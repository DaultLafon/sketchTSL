const annim = {};
// annim permet d'annimer toute valeur d'un objet avec les propriétés de easing ci-dessous

const easeFunctions = {
  none: t => t,
  power1: {
      in: t => t * t,
      out: t => 1 - (1 - t) * (1 - t),
      inout: t => t < 0.5 ? t * t * 2 : 1 - Math.pow(-2 * t + 2, 2) / 2,
  },
  power2: {
      in: t => t * t,
      out: t => 1 - (1 - t) * (1 - t),
      inout: t => t < 0.5 ? t * t * 2 : 1 - Math.pow(-2 * t + 2, 2) / 2,
  },
  power3: {
      in: t => t ** 3,
      out: t => 1 - (1 - t) ** 3,
      inout: t => t < 0.5 ? (t * 2) ** 3 / 2 : 1 - (2 - t * 2) ** 3 / 2,
  },
  power4: {
      in: t => t ** 4,
      out: t => 1 - (1 - t) ** 4,
      inout: t => t < 0.5 ? (t * 2) ** 4 / 2 : 1 - (2 - t * 2) ** 4 / 2,
  },
  back: {
      in: t => t * t * (2.70158 * t - 1.70158),
      out: t => 1 + (--t) * t * (2.70158 * t + 1.70158),
      inout: t => {
          const c1 = 1.70158 * 1.525;
          const c3 = c1 + 1;
          return t < 0.5 ?
              (2 * t) ** 2 * ((c3 + 1) * 2 * t - c3) / 2 :
              ((2 * t - 2) ** 2 * ((c3 + 1) * (t * 2 - 2) + c3) + 2) / 2;
      },
  }
};

annim.to = (
  element,
  {
    duration = 1,
    easing = "none",
    onComplete = () => console.log("Terminé"),
    ...properties
  }
) => {
    const [easeKey, easeFunction] = easing.split('.');
    
    if (!(easeKey in easeFunctions)) {
        console.error(`La clé "${easeKey}" n'existe pas dans l'objet easeFunctions.`);
        return;
    }

    const selectedEaseFunction = easeFunctions[easeKey][easeFunction] || easeFunctions.none;

    const startValues = {}; // Stocke les valeurs de départ des propriétés
    const ranges = {}; // Stocke les distances à parcourir pour chaque propriété

    // Calcul des valeurs de départ et des distances à parcourir pour chaque propriété
    for (const prop in properties) {
        startValues[prop] = element[prop] ?? 0;
        ranges[prop] = properties[prop] - startValues[prop];
    }

    const startTime = performance.now();
    duration *= 1000;

    const update = (timeStamp) => {
        const elapsedTime = timeStamp - startTime;
        let progress = elapsedTime / duration;
        progress = selectedEaseFunction(Math.min(progress, 1));
        
        if (progress < 1) {
            // Mise à jour de chaque propriété en fonction de sa valeur de départ et de la distance à parcourir
            for (const prop in properties) {
                element[prop] = startValues[prop] + ranges[prop] * progress;
            }
        } else {
            onComplete();
            return;
        }
        requestAnimationFrame(update);
    };
    update(startTime);
};
/**
 * exemple de code : 
 * 
 * annim.to(
    torusKnot.position, 
    {  duration:2 , x:3, easing: 'power1.in'}
)
annim.to(material, {opacity:1, duration:2})
 */
export default annim;
