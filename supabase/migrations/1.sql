
-- Table pour les équipes
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Créer un trigger pour mettre à jour le timestamp
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table pour les membres de l'équipe
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(team_id, user_id)
);

-- Table pour les tâches d'équipe
CREATE TABLE IF NOT EXISTS team_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  category TEXT DEFAULT 'general',
  tags TEXT[],
  attachments TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Trigger pour mise à jour du timestamp
CREATE TRIGGER update_team_tasks_updated_at BEFORE UPDATE ON team_tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table pour les commentaires sur les tâches
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES team_tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger pour mise à jour du timestamp
CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON task_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vue pour obtenir les tâches avec les informations supplémentaires
CREATE OR REPLACE VIEW team_tasks_view AS
SELECT 
  tt.*,
  t.name as team_name,
  p.full_name as assigned_to_name,
  p.avatar_url as assigned_to_avatar,
  creator.full_name as created_by_name,
  creator.avatar_url as created_by_avatar,
  (
    SELECT COUNT(*) 
    FROM task_comments tc 
    WHERE tc.task_id = tt.id
  ) as comments_count
FROM team_tasks tt
LEFT JOIN teams t ON t.id = tt.team_id
LEFT JOIN profiles p ON p.id = tt.assigned_to
LEFT JOIN profiles creator ON creator.id = tt.created_by;

-- Politique de sécurité pour les équipes
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Équipes visibles par les membres" ON teams
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM team_members WHERE team_id = id
    )
  );

CREATE POLICY "Équipes modifiables par les propriétaires et admins" ON teams
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM team_members 
      WHERE team_id = id AND role IN ('owner', 'admin')
    )
  );

-- Politique de sécurité pour les tâches d'équipe
ALTER TABLE team_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tâches visibles par les membres de l'équipe" ON team_tasks
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM team_members WHERE team_id = team_id
    )
  );

CREATE POLICY "Tâches modifiables par les membres assignés et admins" ON team_tasks
  FOR UPDATE USING (
    auth.uid() = assigned_to OR
    auth.uid() IN (
      SELECT user_id FROM team_members 
      WHERE team_id = team_id AND role IN ('owner', 'admin')
    )
  );

-- Fonction pour obtenir toutes les tâches d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_team_tasks(p_user_id UUID)
RETURNS SETOF team_tasks_view
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM team_tasks_view
  WHERE assigned_to = p_user_id
  OR p_user_id IN (
    SELECT user_id FROM team_members 
    WHERE team_id = team_id AND role IN ('owner', 'admin')
  )
  ORDER BY 
    CASE 
      WHEN status = 'pending' AND due_date < NOW() THEN 0
      WHEN priority = 'urgent' THEN 1
      WHEN priority = 'high' THEN 2
      WHEN status = 'in_progress' THEN 3
      ELSE 4
    END,
    due_date NULLS LAST,
    created_at DESC;
END;
$$;
