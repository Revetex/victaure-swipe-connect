import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-12"
    >
      <section className="legal-section">
        <h1 className="legal-title">Conditions d'utilisation</h1>
        <div className="legal-content">
          <p>Bienvenue sur notre site web. Si vous continuez à naviguer et à utiliser ce site web, vous acceptez de respecter et d'être lié par les conditions d'utilisation suivantes, qui, avec notre politique de confidentialité, régissent la relation de [nom de l'entreprise] avec vous concernant ce site web.</p>

          <p>Le terme '[nom de l'entreprise]' ou 'nous' ou 'notre' se réfère au propriétaire du site web. Le terme 'vous' se réfère à l'utilisateur ou au visiteur de notre site web.</p>

          <p>L'utilisation de ce site web est soumise aux conditions d'utilisation suivantes :</p>

          <ul>
            <li>Le contenu des pages de ce site web est fourni à titre d'information générale et d'utilisation uniquement. Il est susceptible d'être modifié sans préavis.</li>
            <li>Ni nous ni aucun tiers ne fournissons aucune garantie quant à l'exactitude, l'actualité, la performance, l'exhaustivité ou la pertinence des informations et des matériaux trouvés ou offerts sur ce site web à quelque fin que ce soit. Vous reconnaissez que ces informations et matériaux peuvent contenir des inexactitudes ou des erreurs et nous excluons expressément toute responsabilité pour de telles inexactitudes ou erreurs dans toute la mesure permise par la loi.</li>
            <li>Votre utilisation de toute information ou matériel sur ce site web est entièrement à vos propres risques, pour lesquels nous ne serons pas responsables. Il vous incombe de vous assurer que tous les produits, services ou informations disponibles sur ce site web répondent à vos exigences spécifiques.</li>
            <li>Ce site web contient des éléments qui nous appartiennent ou qui nous sont concédés sous licence. Ces éléments comprennent, sans s'y limiter, la conception, la mise en page, l'apparence, les graphiques et les documents. La reproduction est interdite autrement qu'en conformité avec l'avis de droit d'auteur, qui fait partie intégrante de ces conditions d'utilisation.</li>
            <li>Toutes les marques de commerce reproduites sur ce site web, qui ne sont pas la propriété de l'exploitant ou qui ne lui sont pas concédées sous licence, sont reconnues sur le site web.</li>
            <li>L'utilisation non autorisée de ce site web peut donner lieu à une réclamation en dommages-intérêts et/ou constituer une infraction pénale.</li>
            <li>De temps à autre, ce site web peut également inclure des liens vers d'autres sites web. Ces liens sont fournis pour votre commodité afin de fournir de plus amples informations. Ils ne signifient pas que nous approuvons le(s) site(s) web. Nous n'assumons aucune responsabilité quant au contenu du ou des sites web liés.</li>
            <li>Votre utilisation de ce site web et tout litige découlant d'une telle utilisation du site web sont soumis aux lois du Québec.</li>
          </ul>
        </div>
      </section>
    </motion.div>
  );
}
