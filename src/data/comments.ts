import type { Comment } from '@/types'
import { hoursAgo } from '@/lib/date'
import { makeId } from '@/lib/id'

interface CommentSpec {
  ticketId: string
  authorId: string
  content: string
  mentions: string[]
  hoursAgoValue: number
}

const SPECS: CommentSpec[] = [
  // GIR-101 — Export CSV livraisons
  {
    ticketId: 'GIR-101',
    authorId: 'u-nicolas',
    content: "J'ai identifié le souci : le timeout Nginx coupe la génération au-delà de 30s. Je passe le job en asynchrone avec envoi par email du lien de téléchargement.",
    mentions: [],
    hoursAgoValue: 700,
  },
  {
    ticketId: 'GIR-101',
    authorId: 'u-camille',
    content: "Parfait, merci @Nicolas. Transalliance attend une réponse, je peux leur dire que c'est en cours de correction ?",
    mentions: ['u-nicolas'],
    hoursAgoValue: 690,
  },
  {
    ticketId: 'GIR-101',
    authorId: 'u-nicolas',
    content: 'Oui, livraison prévue demain matin. Je te tague dès que le correctif est en prod.',
    mentions: [],
    hoursAgoValue: 675,
  },
  // GIR-103 — Incident DHL
  {
    ticketId: 'GIR-103',
    authorId: 'u-thomas',
    content: "J'ai contacté le support DHL, ils confirment un incident de leur côté sur l'API tracking EU. Pas d'ETA pour l'instant.",
    mentions: [],
    hoursAgoValue: 20,
  },
  {
    ticketId: 'GIR-103',
    authorId: 'u-yanis',
    content: "En attendant, je bascule temporairement l'affichage sur le dernier statut connu en cache pour éviter d'afficher une erreur aux clients.",
    mentions: [],
    hoursAgoValue: 15,
  },
  {
    ticketId: 'GIR-103',
    authorId: 'u-thomas',
    content: 'Bonne idée. @Yanis tiens-moi au courant dès que DHL rétablit le service.',
    mentions: ['u-yanis'],
    hoursAgoValue: 14,
  },
  // GIR-104 — Notifications email
  {
    ticketId: 'GIR-104',
    authorId: 'u-sophie',
    content: "On reçoit de plus en plus d'appels de clients qui ne comprennent pas pourquoi ils n'ont pas été prévenus du retard. Ça urge côté support.",
    mentions: [],
    hoursAgoValue: 90,
  },
  {
    ticketId: 'GIR-104',
    authorId: 'u-karim',
    content: "Le worker de notifications était bloqué sur un job corrompu dans la file. Je l'ai purgé et relancé, je surveille les prochains envois.",
    mentions: [],
    hoursAgoValue: 30,
  },
  {
    ticketId: 'GIR-104',
    authorId: 'u-sophie',
    content: 'Je confirme que les notifications repartent, merci @Karim !',
    mentions: ['u-karim'],
    hoursAgoValue: 20,
  },
  // GIR-106 — Délais jours fériés
  {
    ticketId: 'GIR-106',
    authorId: 'u-lea',
    content: "@Nicolas as-tu une estimation de charge pour intégrer le calendrier des jours fériés français ? On aimerait le planifier pour le prochain sprint.",
    mentions: ['u-nicolas'],
    hoursAgoValue: 200,
  },
  {
    ticketId: 'GIR-106',
    authorId: 'u-nicolas',
    content: "J'utilise la librairie officielle des jours fériés, ça devrait prendre 1 jour. Je commence demain.",
    mentions: [],
    hoursAgoValue: 190,
  },
  // GIR-108 — Connecteur Chronopost
  {
    ticketId: 'GIR-108',
    authorId: 'u-sophie',
    content: "Plusieurs clients Chronopost nous signalent des statuts « Livré » alors que le colis est encore en agence. Ça génère des réclamations.",
    mentions: [],
    hoursAgoValue: 180,
  },
  {
    ticketId: 'GIR-108',
    authorId: 'u-yanis',
    content: "Confirmé, le webhook Chronopost envoie le mauvais code statut pour l'étape « en agence ». J'ai ouvert un ticket auprès de leur support technique.",
    mentions: [],
    hoursAgoValue: 60,
  },
  // GIR-110 — Ralentissement plateforme
  {
    ticketId: 'GIR-110',
    authorId: 'u-karim',
    content: "Pic de charge sur la base identifié : une requête de reporting mal indexée tournait en boucle. Index ajouté, les temps de réponse sont revenus à la normale.",
    mentions: [],
    hoursAgoValue: 3,
  },
  {
    ticketId: 'GIR-110',
    authorId: 'u-thomas',
    content: 'Merci pour la réactivité, on garde un œil sur les métriques cet après-midi.',
    mentions: [],
    hoursAgoValue: 2,
  },
  // GIR-112 — QR code tronqué
  {
    ticketId: 'GIR-112',
    authorId: 'u-yanis',
    content: "Ça vient du template d'étiquette pour les imprimantes Zebra ZD420, la marge droite est trop faible. Je corrige le gabarit.",
    mentions: [],
    hoursAgoValue: 220,
  },
  {
    ticketId: 'GIR-112',
    authorId: 'u-thomas',
    content: "@Yanis penses-tu qu'il faille aussi vérifier les imprimantes Zebra GK420 ? On en a aussi dans 2 entrepôts.",
    mentions: ['u-yanis'],
    hoursAgoValue: 200,
  },
  {
    ticketId: 'GIR-112',
    authorId: 'u-yanis',
    content: 'Bonne remarque, je teste sur les deux modèles avant de fermer le ticket.',
    mentions: [],
    hoursAgoValue: 190,
  },
  // GIR-114 — Module retours stock
  {
    ticketId: 'GIR-114',
    authorId: 'u-thomas',
    content: "Les équipes entrepôt font le recalcul à la main pour l'instant, mais ça prend un temps fou sur les grosses périodes de retours.",
    mentions: [],
    hoursAgoValue: 280,
  },
  {
    ticketId: 'GIR-114',
    authorId: 'u-nicolas',
    content: "Je m'y mets cette semaine, ça touche le même service que le calcul de marge logistique donc je vais faire les deux ensemble.",
    mentions: [],
    hoursAgoValue: 100,
  },
  // GIR-116 — Double facturation
  {
    ticketId: 'GIR-116',
    authorId: 'u-camille',
    content: "@Karim @Thomas on a 6 clients premium touchés pour l'instant, il faut traiter ça en urgence absolue avant que d'autres factures ne partent.",
    mentions: ['u-karim', 'u-thomas'],
    hoursAgoValue: 4,
  },
  // GIR-118 — Filtre en retard dashboard
  {
    ticketId: 'GIR-118',
    authorId: 'u-thomas',
    content: "Ça fausse complètement notre suivi hebdo, le chiffre affiché est toujours surestimé de 10 à 15%.",
    mentions: [],
    hoursAgoValue: 190,
  },
  {
    ticketId: 'GIR-118',
    authorId: 'u-lea',
    content: "Vu avec Nicolas, c'est une requête de filtre à corriger côté dashboard. Je programme ça pour cette semaine.",
    mentions: [],
    hoursAgoValue: 50,
  },
  // GIR-123 — Perte connexion Lyon
  {
    ticketId: 'GIR-123',
    authorId: 'u-yanis',
    content: "Coupures VPN confirmées, le routeur de l'entrepôt de Lyon semble instable. J'ai contacté le prestataire réseau sur place.",
    mentions: [],
    hoursAgoValue: 40,
  },
  {
    ticketId: 'GIR-123',
    authorId: 'u-thomas',
    content: "@Yanis les équipes sur place font la synchro manuellement en attendant, mais ça ne peut pas durer plus d'un jour ou deux.",
    mentions: ['u-yanis'],
    hoursAgoValue: 35,
  },
  // GIR-124 — Intégration SAP
  {
    ticketId: 'GIR-124',
    authorId: 'u-lea',
    content: "Le client a confirmé le périmètre : synchronisation des commandes uniquement dans un premier temps, pas les stocks.",
    mentions: [],
    hoursAgoValue: 300,
  },
  {
    ticketId: 'GIR-124',
    authorId: 'u-karim',
    content: "Ok, je prépare une proposition technique basée sur leur API SAP PI. Je partage ça d'ici vendredi.",
    mentions: [],
    hoursAgoValue: 250,
  },
  {
    ticketId: 'GIR-124',
    authorId: 'u-lea',
    content: 'Top, je planifie un point avec le client dès que ta proposition est prête.',
    mentions: [],
    hoursAgoValue: 80,
  },
  // GIR-125 — Commentaires internes visibles
  {
    ticketId: 'GIR-125',
    authorId: 'u-camille',
    content: "Signalé par un client ce matin, il a vu une note interne mentionnant un litige de paiement. C'est très gênant, il faut corriger et couper l'affichage en urgence en attendant.",
    mentions: [],
    hoursAgoValue: 5,
  },
  // GIR-128 — Marge logistique multi-entrepôts
  {
    ticketId: 'GIR-128',
    authorId: 'u-lea',
    content: "La finance a remonté des écarts de marge sur les commandes expédiées depuis plusieurs entrepôts, ça fausse leurs rapports trimestriels.",
    mentions: [],
    hoursAgoValue: 150,
  },
  {
    ticketId: 'GIR-128',
    authorId: 'u-nicolas',
    content: "Je reprends la logique de répartition des coûts de transport, elle ne gère pas correctement les expéditions scindées. En cours.",
    mentions: [],
    hoursAgoValue: 60,
  },
  // GIR-130 — Pic erreurs 500 shipments
  {
    ticketId: 'GIR-130',
    authorId: 'u-karim',
    content: "Le déploiement d'hier soir a introduit une régression sur la validation des adresses. @Nicolas peux-tu regarder le commit de 22h ?",
    mentions: ['u-nicolas'],
    hoursAgoValue: 10,
  },
  {
    ticketId: 'GIR-130',
    authorId: 'u-nicolas',
    content: "Je regarde ça tout de suite, si besoin je propose un rollback en attendant le correctif.",
    mentions: [],
    hoursAgoValue: 9,
  },
]

export const comments: Comment[] = SPECS.map((spec) => ({
  id: makeId('cmt'),
  ticketId: spec.ticketId,
  authorId: spec.authorId,
  content: spec.content,
  mentions: spec.mentions,
  createdAt: hoursAgo(spec.hoursAgoValue).toISOString(),
}))
