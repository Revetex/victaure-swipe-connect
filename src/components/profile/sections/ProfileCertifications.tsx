
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Certification, UserProfile } from "@/types/profile";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { PlusCircle, Award, Calendar, ExternalLink, Trash, Edit, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProfileCertificationsProps {
  profile: UserProfile;
  isEditable?: boolean;
  onUpdate?: (profile: UserProfile) => void;
}

export function ProfileCertifications({ profile, isEditable = false, onUpdate }: ProfileCertificationsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [formData, setFormData] = useState<Certification>({
    id: '',
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: null,
    credential_url: '',
    credential_id: '',
    description: '',
    year: '',
  });

  const handleOpenDialog = (certification?: Certification) => {
    if (certification) {
      setEditingCertification(certification);
      setFormData(certification);
    } else {
      setEditingCertification(null);
      setFormData({
        id: crypto.randomUUID(),
        title: '',
        issuer: '',
        issue_date: '',
        expiry_date: null,
        credential_url: '',
        credential_id: '',
        description: '',
        year: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCertification(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.issuer) {
      toast.error("Le titre et l'organisme sont requis");
      return;
    }

    const certifications = [...(profile.certifications || [])];
    
    if (editingCertification) {
      // Mise à jour
      const index = certifications.findIndex((c) => c.id === editingCertification.id);
      if (index !== -1) {
        certifications[index] = formData;
      }
    } else {
      // Ajout
      certifications.push(formData);
    }

    onUpdate?.({
      ...profile,
      certifications,
    });

    toast.success(editingCertification ? "Certification mise à jour" : "Certification ajoutée");
    handleCloseDialog();
  };

  const handleDelete = (certId: string) => {
    const certifications = profile.certifications?.filter((c) => c.id !== certId) || [];
    
    onUpdate?.({
      ...profile,
      certifications,
    });
    
    toast.success("Certification supprimée");
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Certifications</h3>
        {isEditable && (
          <Button onClick={() => handleOpenDialog()} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      {profile.certifications && profile.certifications.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {profile.certifications.map((certification) => (
            <Card key={certification.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{certification.title}</CardTitle>
                    <CardDescription>{certification.issuer}</CardDescription>
                  </div>
                  <Award className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{certification.issue_date ? formatDate(certification.issue_date) : certification.year}</span>
                    {certification.expiry_date && (
                      <span> - {formatDate(certification.expiry_date)}</span>
                    )}
                  </div>
                  
                  {certification.credential_id && (
                    <div className="text-sm">
                      <Badge variant="secondary" className="font-normal mr-1">ID</Badge>
                      {certification.credential_id}
                    </div>
                  )}
                  
                  {certification.description && (
                    <p className="text-sm text-muted-foreground mt-2">{certification.description}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                {certification.credential_url && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={() => window.open(certification.credential_url, '_blank')}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Voir la certification
                  </Button>
                )}
                
                {isEditable && (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleOpenDialog(certification)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(certification.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/20 rounded-lg">
          <Award className="h-12 w-12 mx-auto text-muted" />
          <h3 className="mt-2 text-lg font-medium">Aucune certification</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditable
              ? "Ajoutez vos certifications professionnelles pour renforcer votre profil"
              : "Aucune certification n'a été ajoutée"}
          </p>
          {isEditable && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => handleOpenDialog()}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une certification
            </Button>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCertification ? "Modifier la certification" : "Ajouter une certification"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la certification <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="Ex: AWS Certified Solutions Architect"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issuer">Organisme certificateur <span className="text-red-500">*</span></Label>
              <Input
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                placeholder="Ex: Amazon Web Services"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Date d'obtention</Label>
                <Input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  value={formData.issue_date?.slice(0, 10) || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry_date">Date d'expiration</Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date?.slice(0, 10) || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Année (si date précise inconnue)</Label>
              <Input
                id="year"
                name="year"
                value={formData.year || ''}
                onChange={handleChange}
                placeholder="Ex: 2022"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credential_id">ID de la certification</Label>
              <Input
                id="credential_id"
                name="credential_id"
                value={formData.credential_id || ''}
                onChange={handleChange}
                placeholder="Ex: ABC-123-XYZ"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credential_url">URL de vérification</Label>
              <Input
                id="credential_url"
                name="credential_url"
                value={formData.credential_url || ''}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Décrivez la certification et les compétences acquises"
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button type="submit">
                <CheckCircle className="h-4 w-4 mr-2" />
                {editingCertification ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
