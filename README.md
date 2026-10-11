# Support Doctorat — Analyse statistique & accompagnement doctoral

Site vitrine d'une page, trilingue (français / English / العربية), sans dépendance ni build.
Il suffit d'ouvrir `index.html` : tout fonctionne en local comme en ligne.

```
index.html                 la page
assets/css/style.css       toute la mise en forme
assets/js/i18n.js          les trois traductions (fr / en / ar)
assets/js/main.js          langue, effets 3D, apparitions
assets/favicon.svg         icône de l'onglet
.nojekyll                  requis par GitHub Pages
```

---

## Mettre le site en ligne sur GitHub Pages (gratuit)

1. Créez un dépôt sur GitHub, par exemple `support-doctorat`. Cochez **Public**.
2. Bouton **Add file → Upload files**, glissez **le contenu** du dossier
   (`index.html`, le dossier `assets`, `.nojekyll`) — pas le dossier parent lui-même.
3. **Commit changes**.
4. Onglet **Settings → Pages**. Sous *Source*, choisissez **Deploy from a branch**,
   branche `main`, dossier `/ (root)`. **Save**.
5. Attendez une à deux minutes. L'adresse s'affiche en haut de la page :
   `https://VOTRE-NOM.github.io/support-doctorat/`

> Si le fichier `.nojekyll` n'apparaît pas après l'upload (certains navigateurs
> masquent les fichiers commençant par un point), créez-le sur GitHub :
> **Add file → Create new file**, nommez-le `.nojekyll`, laissez-le vide, commit.

### Nom de domaine personnalisé
Si vous achetez un domaine (ex. `supportdoctorat.ma`) : dans **Settings → Pages → Custom domain**,
saisissez-le, puis chez votre registrar créez un enregistrement `CNAME` pointant vers
`VOTRE-NOM.github.io`. Cochez ensuite **Enforce HTTPS**.

---

## Modifier le site

**Le numéro WhatsApp** — une seule ligne, en haut de `assets/js/main.js` :

```js
var WA_NUMBER = "212675992835";
```

Format international sans `+` ni `0` initial. Pensez aussi au numéro affiché
dans `index.html` (section contact, trois occurrences de `+212 675 99 28 35`).

**Les textes** — tout est dans `assets/js/i18n.js`, regroupé par clé, les trois
langues côte à côte. Modifiez la valeur, rechargez la page, c'est fait.
Les textes présents dans `index.html` ne servent que d'affichage de secours
si le JavaScript est désactivé : gardez-les cohérents avec la version française.

**Les couleurs** — les variables en haut de `assets/css/style.css` :

```css
--violet:#7B61FF;   /* accent principal */
--cyan:#35D6E8;     /* accent secondaire */
--amber:#FFB86B;    /* zone de significativité, mises en avant */
--void:#0A0B1E;     /* fond */
```

**Ajouter une prestation** — copiez un bloc `<article class="card tilt reveal">`
dans `index.html`, changez le numéro et les clés `data-i18n`, puis ajoutez les
trois traductions correspondantes dans `i18n.js`.

---

## Ce qui reste à ajouter quand vous l'aurez

- une photo de vous dans la section contact (la confiance se gagne avec un visage) ;
- deux ou trois témoignages de doctorants accompagnés, avec prénom et discipline ;
- une grille tarifaire indicative — c'est l'élément qui convertit le plus sur ce type de page ;
- un formulaire de contact par e-mail en complément de WhatsApp (Formspree se branche en cinq minutes, sans serveur).

---

## Détails techniques

- Aucune bibliothèque : HTML, CSS et JavaScript natifs.
- Effets de profondeur en CSS 3D (`perspective`, `translateZ`), parallaxe au curseur.
- Support RTL complet pour l'arabe (propriétés logiques, `dir="rtl"`, police Cairo).
- La langue choisie est mémorisée dans le navigateur ; à la première visite,
  la langue du navigateur est détectée.
- `prefers-reduced-motion` respecté : toutes les animations se désactivent.
- Polices chargées depuis Google Fonts ; en cas de coupure réseau, les polices
  système prennent le relais sans casser la mise en page.
