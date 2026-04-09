import React, { useState, useMemo, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ScatterChart, Scatter, ReferenceLine
} from 'recharts';
import {
  BookOpen, Trophy, ClipboardList, ChevronRight, ChevronDown, Check, X,
  AlertCircle, TreePine, Leaf, Thermometer, ArrowRight,
  Copy, CheckCircle2, Beaker, TrendingUp, Waves, Info, RotateCcw
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// TRANSLATIONS — every student-facing string in EN and ES
// ═══════════════════════════════════════════════════════════════════
const translations = {
  welcome: { en: "Welcome to", es: "Bienvenido a" },
  appTitle: { en: "B4: Ecosystems & Ecology", es: "B4: Ecosistemas y Ecología" },
  appSubtitle: { en: "IB Biology — Theme B: Form and Function", es: "Biología IB — Tema B: Forma y Función" },
  enterName: { en: "Enter your name to begin", es: "Ingresa tu nombre para comenzar" },
  namePlaceholder: { en: "Your full name", es: "Tu nombre completo" },
  startButton: { en: "Start Learning", es: "Comenzar a aprender" },
  learn: { en: "Learn", es: "Aprender" },
  challenge: { en: "Challenge", es: "Desafío" },
  compileSubmit: { en: "Compile & Submit", es: "Compilar y Enviar" },
  conceptCheck: { en: "Concept Check", es: "Verificación de concepto" },
  checkAnswer: { en: "Check Answer", es: "Verificar respuesta" },
  correct: { en: "Correct!", es: "¡Correcto!" },
  incorrect: { en: "Not quite.", es: "No exactamente." },
  tryAgain: { en: "Try again", es: "Intenta de nuevo" },
  revealAnswer: { en: "Reveal Answer", es: "Revelar respuesta" },
  interactiveTitle: { en: "Interactive Activity", es: "Actividad Interactiva" },
  reset: { en: "Reset", es: "Reiniciar" },
  challengeIntro: {
    en: "Answer each question below using proper IB terminology. Type your response before revealing the model answer.",
    es: "Responde cada pregunta usando terminología IB adecuada. Escribe tu respuesta antes de revelar la respuesta modelo."
  },
  yourAnswer: { en: "Type your answer here...", es: "Escribe tu respuesta aquí..." },
  revealModel: { en: "Reveal Model Answer", es: "Revelar Respuesta Modelo" },
  modelAnswer: { en: "Model Answer", es: "Respuesta Modelo" },
  difficulty: { en: "Difficulty", es: "Dificultad" },
  marks: { en: "marks", es: "puntos" },
  compileIntro: {
    en: "Click below to compile all of your Challenge responses alongside the model answers. Then copy to clipboard and paste into your Google Doc for submission.",
    es: "Haz clic abajo para compilar todas tus respuestas del Desafío junto con las respuestas modelo. Luego copia al portapapeles y pega en tu Google Doc para entregar."
  },
  compileButton: { en: "Compile Responses", es: "Compilar Respuestas" },
  copyButton: { en: "Copy to Clipboard", es: "Copiar al Portapapeles" },
  copied: { en: "Copied!", es: "¡Copiado!" },
  studentName: { en: "Student Name", es: "Nombre del Estudiante" },
  language: { en: "Language", es: "Idioma" },
  compiledHeader: {
    en: "B4: Ecosystems & Ecology — Challenge Responses",
    es: "B4: Ecosistemas y Ecología — Respuestas del Desafío"
  },
  question: { en: "Question", es: "Pregunta" },
  myResponse: { en: "My Response", es: "Mi Respuesta" },
  notAnswered: { en: "[No response entered]", es: "[Sin respuesta ingresada]" },
  footerTheme: {
    en: "IB Biology — Theme B: Form and Function — Ecosystems & Ecology",
    es: "Biología IB — Tema B: Forma y Función — Ecosistemas y Ecología"
  },
  footerBiozone: { en: "Biozone Pages: 209–218", es: "Páginas de Biozone: 209–218" },

  // ─── CHUNK 1: Habitats & Ecosystems ────────────────────────────
  chunk1Title: { en: "Habitats & Ecosystems", es: "Hábitats y Ecosistemas" },
  chunk1Content: {
    en: `A **habitat** is the environment in which an organism or group of organisms lives. It includes all of the physical (abiotic) and biological (biotic) factors in the area. Each species has its own specific habitat which contains all of the resources it needs for survival and is determined by factors such as temperature, moisture, light, and food availability.

A habitat may be a specific description of the area in which a species or organism lives — for example, the sandy edges of a lake — or it can be a more general description, such as a forest, a desert, or the open ocean. The more specific the description, the smaller the range of organisms that may live in that habitat type.

**Habitats are not homogeneous.** A forest, for example, contains many smaller, more specific habitats (microhabitats): the canopy, the forest floor, the leaf litter, a rotting log, or even the surface of a single leaf. Each microhabitat has its own unique set of abiotic conditions and supports its own community of organisms.

A habitat can also vary in **scale**:
• A habitat may be vast — for example, the open ocean, which covers most of the planet
• For non-mobile organisms such as bacteria, the habitat may be defined by the particular environment of a relatively small area, such as a decaying log
• For microscopic organisms, the habitat can be as small as the surface of a single cell or the interior of a host organism's gut

An **ecosystem** includes the interactions between organisms and the environment. It is different from a habitat because it describes the relationships and energy flow, not just the physical space. Ecosystems can vary in scale, but they are always smaller than a biome. An ecosystem may include many habitats — for example, a coral reef ecosystem contains habitats ranging from deep crevices to sunlit shallow waters to sandy bottoms.

**Key distinction:** A habitat is **where** an organism lives. An ecosystem is the habitat **plus** all the interactions between the living organisms and the non-living environment within that area. A city, for instance, can be described as both a habitat (the physical place where organisms live) and an ecosystem (because organisms interact with each other and with their urban environment).`,
    es: `Un **hábitat** es el ambiente en el que vive un organismo o grupo de organismos. Incluye todos los factores físicos (abióticos) y biológicos (bióticos) del área. Cada especie tiene su propio hábitat específico que contiene todos los recursos que necesita para sobrevivir y está determinado por factores como la temperatura, la humedad, la luz y la disponibilidad de alimento.

Un hábitat puede ser una descripción específica del área en la que vive una especie u organismo — por ejemplo, los bordes arenosos de un lago — o puede ser una descripción más general, como un bosque, un desierto o el océano abierto. Cuanto más específica sea la descripción, menor será el rango de organismos que pueden vivir en ese tipo de hábitat.

**Los hábitats no son homogéneos.** Un bosque, por ejemplo, contiene muchos hábitats más pequeños y específicos (microhábitats): el dosel, el suelo del bosque, la hojarasca, un tronco en descomposición o incluso la superficie de una sola hoja. Cada microhábitat tiene su propio conjunto único de condiciones abióticas y sostiene su propia comunidad de organismos.

Un hábitat también puede variar en **escala**:
• Un hábitat puede ser vasto — por ejemplo, el océano abierto, que cubre la mayor parte del planeta
• Para organismos no móviles como las bacterias, el hábitat puede definirse por el ambiente particular de un área relativamente pequeña, como un tronco en descomposición
• Para organismos microscópicos, el hábitat puede ser tan pequeño como la superficie de una sola célula o el interior del intestino de un organismo huésped

Un **ecosistema** incluye las interacciones entre los organismos y el ambiente. Es diferente de un hábitat porque describe las relaciones y el flujo de energía, no solo el espacio físico. Los ecosistemas pueden variar en escala, pero siempre son más pequeños que un bioma. Un ecosistema puede incluir muchos hábitats — por ejemplo, un ecosistema de arrecife de coral contiene hábitats que van desde grietas profundas hasta aguas poco profundas iluminadas por el sol hasta fondos arenosos.

**Distinción clave:** Un hábitat es **donde** vive un organismo. Un ecosistema es el hábitat **más** todas las interacciones entre los organismos vivos y el ambiente no vivo dentro de esa área. Una ciudad, por ejemplo, puede describirse tanto como un hábitat (el lugar físico donde viven los organismos) como un ecosistema (porque los organismos interactúan entre sí y con su ambiente urbano).`
  },
  chunk1CC1Question: {
    en: "Which statement best distinguishes a habitat from an ecosystem?",
    es: "¿Cuál afirmación distingue mejor un hábitat de un ecosistema?"
  },
  chunk1CC1Options: {
    en: [
      "A habitat is always larger than an ecosystem",
      "A habitat is the physical place where an organism lives; an ecosystem also includes all the interactions between organisms and their environment",
      "An ecosystem only includes abiotic factors, while a habitat includes biotic factors",
      "Habitats and ecosystems are the same thing at different scales"
    ],
    es: [
      "Un hábitat siempre es más grande que un ecosistema",
      "Un hábitat es el lugar físico donde vive un organismo; un ecosistema también incluye todas las interacciones entre los organismos y su ambiente",
      "Un ecosistema solo incluye factores abióticos, mientras que un hábitat incluye factores bióticos",
      "Los hábitats y los ecosistemas son lo mismo a diferentes escalas"
    ]
  },
  chunk1CC1Correct: { en: 1, es: 1 },
  chunk1CC1Explanation: {
    en: "A habitat refers to the physical environment where an organism lives. An ecosystem goes further — it includes the habitat plus all the interactions (biotic and abiotic) and energy flows within that area. The other options contain inaccuracies about scale and factor types.",
    es: "Un hábitat se refiere al ambiente físico donde vive un organismo. Un ecosistema va más allá — incluye el hábitat más todas las interacciones (bióticas y abióticas) y los flujos de energía dentro de esa área. Las otras opciones contienen inexactitudes sobre la escala y los tipos de factores."
  },

  // ─── CHUNK 2: Plant Adaptations ────────────────────────────────
  chunk2Title: { en: "Plant Adaptations to Extreme Environments", es: "Adaptaciones de las Plantas a Ambientes Extremos" },
  chunk2Content: {
    en: `Plants in extreme environments have special adaptations to survive. These adaptations are primarily structural features that help them conserve water, tolerate salt, or cope with unstable substrates.

**Xerophytes — Adaptations to Conserve Water**

Plants that live in dry environments (xerophytes) must minimize water loss while still allowing gas exchange for photosynthesis. Key adaptations include:

• **Thick, waxy cuticle** — a waterproof layer on the leaf surface that reduces evaporation from epidermal cells. The thicker the cuticle, the less water is lost.
• **Sunken stomata** — stomata located in pits or grooves below the leaf surface. This traps a layer of moist, still air around the stomatal pore, reducing the water potential gradient between the leaf interior and the outside air, thereby slowing transpiration.
• **Rolled leaves** — leaves that roll inward (e.g., marram grass) trap humid air inside the roll, reducing the rate of water loss. The stomata are located on the inner surface, further protecting them from dry external air.
• **Reduced leaves or spines** — some plants, like cacti, have leaves reduced to spines. This dramatically reduces the surface area available for transpiration. Photosynthesis occurs in the green, fleshy stem instead.
• **Deep or extensive root systems** — tap roots that reach deep groundwater, or widespread shallow roots that quickly absorb surface moisture after rare rainfall events.
• **Succulent tissues** — fleshy stems or leaves that store water for use during prolonged dry periods. Cacti and aloe plants are well-known examples.

**Adaptations to Sand Dunes**

Sand dune plants, such as **marram grass**, face challenges including shifting sand, low nutrient availability, wind exposure, and rapid water drainage. Marram grass has rolled leaves to reduce water loss, and its extensive root and rhizome system helps bind the sand, stabilizing the dune and allowing soil to gradually build up.

**Halophytes — Adaptations to High Salt Environments**

Plants that grow in salty environments (halophytes) face osmotic stress — high external salt concentrations can draw water out of roots. **Mangroves** are the classic example of halophytes, growing in coastal tidal zones. Their adaptations include:

• **Prop roots (stilt roots)** — aerial roots that grow from the trunk and branches down into the mud, providing structural support in soft, waterlogged substrate and resistance to tidal forces.
• **Pneumatophores** — specialized aerial roots that grow upward out of the mud and water. These have small pores (lenticels) that allow gas exchange, since the waterlogged, anaerobic mud prevents roots from obtaining oxygen through normal absorption.
• **Salt-excreting glands** — specialized glands on leaves that actively secrete excess salt, which can sometimes be seen as white crystals on the leaf surface.
• **Salt-filtering roots** — some mangrove species have roots that filter out most salt at the point of water uptake through ultrafiltration, preventing excess salt from entering the plant.
• **Thick, leathery leaves** — with a waxy cuticle to reduce water loss, since the salty environment makes water uptake difficult despite being surrounded by water.`,
    es: `Las plantas en ambientes extremos tienen adaptaciones especiales para sobrevivir. Estas adaptaciones son principalmente características estructurales que les ayudan a conservar agua, tolerar la sal o hacer frente a sustratos inestables.

**Xerófitas — Adaptaciones para Conservar Agua**

Las plantas que viven en ambientes secos (xerófitas) deben minimizar la pérdida de agua mientras permiten el intercambio gaseoso para la fotosíntesis. Las adaptaciones clave incluyen:

• **Cutícula gruesa y cerosa** — una capa impermeable en la superficie de la hoja que reduce la evaporación de las células epidérmicas. Cuanto más gruesa es la cutícula, menos agua se pierde.
• **Estomas hundidos** — estomas ubicados en fosas o surcos debajo de la superficie de la hoja. Esto atrapa una capa de aire húmedo y quieto alrededor del poro estomático, reduciendo el gradiente de potencial hídrico entre el interior de la hoja y el aire exterior, disminuyendo así la transpiración.
• **Hojas enrolladas** — hojas que se enrollan hacia adentro (ej., hierba marram) atrapan aire húmedo dentro del enrollamiento, reduciendo la tasa de pérdida de agua. Los estomas están ubicados en la superficie interna, protegiéndolos aún más del aire exterior seco.
• **Hojas reducidas o espinas** — algunas plantas, como los cactus, tienen hojas reducidas a espinas. Esto reduce dramáticamente el área superficial disponible para la transpiración. La fotosíntesis ocurre en el tallo verde y carnoso.
• **Sistemas de raíces profundas o extensas** — raíces pivotantes que alcanzan aguas subterráneas profundas, o raíces superficiales extensas que absorben rápidamente la humedad superficial después de eventos de lluvia raros.
• **Tejidos suculentos** — tallos o hojas carnosas que almacenan agua para uso durante períodos secos prolongados. Los cactus y las plantas de aloe son ejemplos bien conocidos.

**Adaptaciones a Dunas de Arena**

Las plantas de dunas de arena, como la **hierba marram**, enfrentan desafíos como arena movediza, baja disponibilidad de nutrientes, exposición al viento y drenaje rápido de agua. La hierba marram tiene hojas enrolladas para reducir la pérdida de agua, y su extenso sistema de raíces y rizomas ayuda a fijar la arena, estabilizando la duna y permitiendo que el suelo se acumule gradualmente.

**Halófitas — Adaptaciones a Ambientes de Alta Salinidad**

Las plantas que crecen en ambientes salinos (halófitas) enfrentan estrés osmótico — las altas concentraciones de sal externa pueden extraer agua de las raíces. Los **manglares** son el ejemplo clásico de halófitas, creciendo en zonas costeras de mareas. Sus adaptaciones incluyen:

• **Raíces de soporte (raíces zanco)** — raíces aéreas que crecen desde el tronco y las ramas hacia el lodo, proporcionando soporte estructural en sustrato blando y saturado de agua y resistencia a las fuerzas de las mareas.
• **Neumatóforos** — raíces aéreas especializadas que crecen hacia arriba fuera del lodo y el agua. Estas tienen pequeños poros (lenticelas) que permiten el intercambio gaseoso, ya que el lodo saturado y anaeróbico impide que las raíces obtengan oxígeno a través de la absorción normal.
• **Glándulas excretoras de sal** — glándulas especializadas en las hojas que secretan activamente el exceso de sal, que a veces se puede ver como cristales blancos en la superficie de la hoja.
• **Raíces filtradoras de sal** — algunas especies de manglar tienen raíces que filtran la mayoría de la sal en el punto de absorción de agua a través de ultrafiltración, evitando que el exceso de sal entre en la planta.
• **Hojas gruesas y coriáceas** — con una cutícula cerosa para reducir la pérdida de agua, ya que el ambiente salino dificulta la absorción de agua a pesar de estar rodeado de agua.`
  },
  chunk2CC1Question: {
    en: "Explain how two structural adaptations of xerophytes help reduce water loss from leaves.",
    es: "Explica cómo dos adaptaciones estructurales de las xerófitas ayudan a reducir la pérdida de agua de las hojas."
  },
  chunk2CC1Answer: {
    en: "1) Sunken stomata are located in pits below the leaf surface. This traps a layer of moist, still air around the stomatal pore, reducing the water potential gradient between the leaf interior and the dry outside air, which slows the rate of transpiration. 2) A thick, waxy cuticle covers the leaf surface and acts as a waterproof barrier, reducing evaporation of water from the epidermal cells directly through the leaf surface.",
    es: "1) Los estomas hundidos están ubicados en fosas debajo de la superficie de la hoja. Esto atrapa una capa de aire húmedo y quieto alrededor del poro estomático, reduciendo el gradiente de potencial hídrico entre el interior de la hoja y el aire seco exterior, lo que disminuye la tasa de transpiración. 2) Una cutícula gruesa y cerosa cubre la superficie de la hoja y actúa como barrera impermeable, reduciendo la evaporación de agua de las células epidérmicas directamente a través de la superficie de la hoja."
  },

  // ─── CHUNK 3: Tolerance & Distribution ─────────────────────────
  chunk3Title: { en: "Tolerance Ranges & Population Distribution", es: "Rangos de Tolerancia y Distribución Poblacional" },
  chunk3Content: {
    en: `Every organism can tolerate a range of conditions for each abiotic factor it encounters — temperature, light, pH, salinity, moisture, oxygen concentration, and others. This is called the organism's **tolerance range**.

The tolerance range follows a characteristic bell-shaped curve:

• **Optimal range** — the narrow range of conditions where the organism performs best (highest growth, reproduction, and survival). This is the peak of the curve.
• **Zones of stress** — on either side of the optimal range, conditions become less favorable. The organism can survive but experiences physiological stress, reducing its growth and reproductive success.
• **Limits of tolerance** — the extreme values beyond which the organism cannot survive. Outside these limits, the abiotic factor becomes lethal.

**Tolerance determines distribution.** Species are found in habitats where the abiotic conditions fall within their tolerance range. The more factors that are optimal, the larger and healthier the population will be. Where conditions are at the extremes of tolerance, populations are smaller and less productive.

**Specialist vs. generalist species:**
• **Specialists** have narrow tolerance ranges — they thrive in very specific conditions but cannot tolerate much variation (e.g., coral reef organisms that require very specific water temperatures and pH).
• **Generalists** have broad tolerance ranges — they can survive in a wide range of conditions but may not be optimally adapted to any single set (e.g., rats, cockroaches, and raccoons thrive in many environments).

**Responses to environmental change:**
When abiotic conditions change beyond an organism's tolerance range, it may respond in several ways:
1. **Behavioral response** — the organism moves to a more favorable location (e.g., seasonal migration of birds, vertical migration of zooplankton in lakes)
2. **Physiological response (acclimation)** — the organism adjusts its internal processes to cope with new conditions (e.g., producing heat-shock proteins, adjusting metabolic rate)
3. **Death** — if the change is too rapid or extreme for the organism to move or adjust, it will die

**Seasonal changes in distribution** are well illustrated by zooplankton in temperate lakes. In winter, zooplankton may be evenly distributed in the cold, well-mixed water. In summer, thermal stratification creates distinct temperature layers, and zooplankton migrate vertically — moving to deeper, cooler water during the day (to avoid predators in the lit zone) and rising to surface waters at night to feed on phytoplankton.`,
    es: `Todo organismo puede tolerar un rango de condiciones para cada factor abiótico que encuentra — temperatura, luz, pH, salinidad, humedad, concentración de oxígeno y otros. Esto se llama el **rango de tolerancia** del organismo.

El rango de tolerancia sigue una curva característica en forma de campana:

• **Rango óptimo** — el rango estrecho de condiciones donde el organismo funciona mejor (mayor crecimiento, reproducción y supervivencia). Este es el pico de la curva.
• **Zonas de estrés** — a cada lado del rango óptimo, las condiciones se vuelven menos favorables. El organismo puede sobrevivir pero experimenta estrés fisiológico, reduciendo su crecimiento y éxito reproductivo.
• **Límites de tolerancia** — los valores extremos más allá de los cuales el organismo no puede sobrevivir. Fuera de estos límites, el factor abiótico se vuelve letal.

**La tolerancia determina la distribución.** Las especies se encuentran en hábitats donde las condiciones abióticas caen dentro de su rango de tolerancia. Cuantos más factores sean óptimos, más grande y saludable será la población. Donde las condiciones están en los extremos de tolerancia, las poblaciones son más pequeñas y menos productivas.

**Especies especialistas vs. generalistas:**
• **Especialistas** tienen rangos de tolerancia estrechos — prosperan en condiciones muy específicas pero no pueden tolerar mucha variación (ej., organismos de arrecifes de coral que requieren temperaturas de agua y pH muy específicos).
• **Generalistas** tienen rangos de tolerancia amplios — pueden sobrevivir en una amplia gama de condiciones pero pueden no estar óptimamente adaptados a ningún conjunto en particular (ej., ratas, cucarachas y mapaches prosperan en muchos ambientes).

**Respuestas al cambio ambiental:**
Cuando las condiciones abióticas cambian más allá del rango de tolerancia de un organismo, puede responder de varias maneras:
1. **Respuesta conductual** — el organismo se mueve a una ubicación más favorable (ej., migración estacional de aves, migración vertical de zooplancton en lagos)
2. **Respuesta fisiológica (aclimatación)** — el organismo ajusta sus procesos internos para adaptarse a las nuevas condiciones (ej., producir proteínas de choque térmico, ajustar la tasa metabólica)
3. **Muerte** — si el cambio es demasiado rápido o extremo para que el organismo se mueva o se ajuste, morirá

**Los cambios estacionales en la distribución** se ilustran bien con el zooplancton en lagos templados. En invierno, el zooplancton puede estar distribuido uniformemente en el agua fría y bien mezclada. En verano, la estratificación térmica crea capas de temperatura distintas, y el zooplancton migra verticalmente — moviéndose a aguas más profundas y frías durante el día (para evitar depredadores en la zona iluminada) y subiendo a aguas superficiales por la noche para alimentarse de fitoplancton.`
  },
  chunk3CC1Question: {
    en: "A species of fish thrives between 15-25°C but can survive between 5-35°C. What is the 15-25°C range called?",
    es: "Una especie de pez prospera entre 15-25°C pero puede sobrevivir entre 5-35°C. ¿Cómo se llama el rango de 15-25°C?"
  },
  chunk3CC1Options: {
    en: ["Limits of tolerance", "Optimal range", "Zone of stress", "Lethal range"],
    es: ["Límites de tolerancia", "Rango óptimo", "Zona de estrés", "Rango letal"]
  },
  chunk3CC1Correct: { en: 1, es: 1 },
  chunk3CC1Explanation: {
    en: "The 15-25°C range where the fish thrives (highest growth and reproduction) is the optimal range. The full 5-35°C range represents the limits of tolerance. The zones between optimal and lethal (5-15°C and 25-35°C) are the zones of stress.",
    es: "El rango de 15-25°C donde el pez prospera (mayor crecimiento y reproducción) es el rango óptimo. El rango completo de 5-35°C representa los límites de tolerancia. Las zonas entre lo óptimo y lo letal (5-15°C y 25-35°C) son las zonas de estrés."
  },

  // ─── CHUNK 4: Ecological Sampling ──────────────────────────────
  chunk4Title: { en: "Ecological Sampling Methods", es: "Métodos de Muestreo Ecológico" },
  chunk4Content: {
    en: `Ecologists use a variety of sampling techniques to measure the distribution and abundance of organisms in their habitats. Direct observation of every organism is usually impractical, so sampling provides a representative picture of the population or community.

**Measuring Abiotic Factors — Sensors and Dataloggers**

Accurate measurement of the physical environment is essential for understanding why organisms are distributed the way they are. Common tools include:

• **Light meter** — measures light intensity (in lux). Important for studying plant distribution and the light environment at different levels of a forest or at different depths in water.
• **pH meter** — measures the acidity or alkalinity of water or soil. Soil pH strongly influences which plant species can grow in an area, as it affects nutrient availability.
• **Digital thermometer** — provides accurate temperature readings. Temperature probes can be used in soil, water, or air. Dataloggers can record temperature continuously over time, capturing daily and seasonal fluctuations.
• **Dataloggers** — electronic devices that automatically record environmental measurements at set intervals. They provide information about how abiotic factors change over time, which is valuable for understanding the conditions organisms actually experience (not just a single snapshot).

**Transect Sampling**

A **transect** is a line or narrow strip placed across an area where there is a clear environmental gradient (e.g., from the top to the bottom of a rocky shore, from a forest edge into its interior, or up a hillside). Transects are used to measure how the distribution of species changes along the gradient.

Types of transect:

• **Line transect** — a tape or string is laid out along the gradient. Species touching or directly above/below the line are recorded at regular intervals. This is the simplest and fastest method but provides limited data.

• **Continuous belt transect** — a strip of fixed width (e.g., 0.5 m or 1 m) is laid out along the entire gradient. Every organism within the belt is identified and counted. This provides the most complete data but is time-consuming and labor-intensive.

• **Interrupted belt transect** — quadrats of a fixed size are placed at regular intervals along the transect line (e.g., every 5 meters). Only the organisms within each quadrat are recorded. This is a compromise between the speed of a line transect and the detail of a continuous belt transect. It gives a representative sample with less effort.

• **Point sampling** — individual points are selected along the transect (e.g., using a frame with pins). The species present at each exact point are recorded. This is useful for dense ground cover where individual organisms are hard to distinguish.

**Choosing the right method** depends on the size of the study area, the time available, the type of organisms being studied, and the level of detail required.`,
    es: `Los ecólogos utilizan una variedad de técnicas de muestreo para medir la distribución y abundancia de organismos en sus hábitats. La observación directa de cada organismo suele ser impráctica, por lo que el muestreo proporciona una imagen representativa de la población o comunidad.

**Medición de Factores Abióticos — Sensores y Registradores de Datos**

La medición precisa del ambiente físico es esencial para entender por qué los organismos se distribuyen de la manera en que lo hacen. Las herramientas comunes incluyen:

• **Medidor de luz** — mide la intensidad de la luz (en lux). Importante para estudiar la distribución de plantas y el ambiente lumínico a diferentes niveles de un bosque o a diferentes profundidades en el agua.
• **Medidor de pH** — mide la acidez o alcalinidad del agua o suelo. El pH del suelo influye fuertemente en qué especies de plantas pueden crecer en un área, ya que afecta la disponibilidad de nutrientes.
• **Termómetro digital** — proporciona lecturas de temperatura precisas. Las sondas de temperatura pueden usarse en suelo, agua o aire. Los registradores de datos pueden registrar la temperatura continuamente a lo largo del tiempo, capturando fluctuaciones diarias y estacionales.
• **Registradores de datos (dataloggers)** — dispositivos electrónicos que registran automáticamente mediciones ambientales a intervalos establecidos. Proporcionan información sobre cómo los factores abióticos cambian con el tiempo, lo cual es valioso para entender las condiciones que los organismos realmente experimentan (no solo una instantánea).

**Muestreo por Transecto**

Un **transecto** es una línea o franja estrecha colocada a través de un área donde hay un gradiente ambiental claro (ej., desde la parte superior hasta la inferior de una costa rocosa, desde el borde de un bosque hacia su interior, o subiendo una ladera). Los transectos se usan para medir cómo cambia la distribución de las especies a lo largo del gradiente.

Tipos de transecto:

• **Transecto de línea** — se coloca una cinta o cuerda a lo largo del gradiente. Las especies que tocan o están directamente arriba/abajo de la línea se registran a intervalos regulares. Este es el método más simple y rápido pero proporciona datos limitados.

• **Transecto de banda continuo** — se coloca una franja de ancho fijo (ej., 0.5 m o 1 m) a lo largo de todo el gradiente. Cada organismo dentro de la banda se identifica y cuenta. Esto proporciona los datos más completos pero consume mucho tiempo y es laborioso.

• **Transecto de banda interrumpido** — se colocan cuadrantes de tamaño fijo a intervalos regulares a lo largo de la línea del transecto (ej., cada 5 metros). Solo se registran los organismos dentro de cada cuadrante. Este es un compromiso entre la velocidad de un transecto de línea y el detalle de un transecto de banda continuo. Da una muestra representativa con menos esfuerzo.

• **Muestreo puntual** — se seleccionan puntos individuales a lo largo del transecto (ej., usando un marco con alfileres). Se registran las especies presentes en cada punto exacto. Esto es útil para cobertura vegetal densa donde los organismos individuales son difíciles de distinguir.

**Elegir el método correcto** depende del tamaño del área de estudio, el tiempo disponible, el tipo de organismos que se estudian y el nivel de detalle requerido.`
  },
  chunk4CC1Question: {
    en: "Explain why an interrupted belt transect might be preferred over a continuous belt transect for studying species distribution across a 200-meter environmental gradient.",
    es: "Explica por qué un transecto de banda interrumpido podría preferirse sobre un transecto de banda continuo para estudiar la distribución de especies a lo largo de un gradiente ambiental de 200 metros."
  },
  chunk4CC1Answer: {
    en: "A continuous belt transect across 200 meters would require identifying and counting every organism within the entire strip, which is extremely time-consuming and labor-intensive. An interrupted belt transect places quadrats at regular intervals (e.g., every 10 meters), providing representative data from across the gradient while requiring significantly less time and effort. It still captures the pattern of species change along the gradient, making it a practical compromise between thoroughness and efficiency.",
    es: "Un transecto de banda continuo de 200 metros requeriría identificar y contar cada organismo dentro de toda la franja, lo cual consume mucho tiempo y es muy laborioso. Un transecto de banda interrumpido coloca cuadrantes a intervalos regulares (ej., cada 10 metros), proporcionando datos representativos de todo el gradiente mientras requiere significativamente menos tiempo y esfuerzo. Aún captura el patrón de cambio de especies a lo largo del gradiente, haciéndolo un compromiso práctico entre exhaustividad y eficiencia."
  },

  // ─── CHUNK 5: Kite Graphs & Shore Zonation ─────────────────────
  chunk5Title: { en: "Kite Graphs & Shore Zonation", es: "Gráficos de Cometa y Zonación Costera" },
  chunk5Content: {
    en: `**Kite graphs** (also called kite diagrams) are a specialized type of graph used to display the distribution and abundance of species along a transect. They are particularly useful for showing how multiple species are distributed across an environmental gradient, such as a rocky shore.

In a kite graph:
• The **x-axis** shows position along the transect (e.g., distance from the low-tide mark, or height above sea level)
• Each species gets its own horizontal band
• The **width of the kite** at any point represents the abundance of that species at that position — wider = more abundant
• The kite is drawn symmetrically above and below a central line for each species

Kite graphs make it easy to see **zonation patterns** — where different species are found along the gradient and how their abundances overlap or are separated.

**Rocky Shore Zonation**

Rocky shores provide one of the best examples of species zonation along an environmental gradient. From the upper shore to the lower shore, abiotic conditions change dramatically:

• **Upper shore (splash zone):** Organisms are only splashed by waves at high tide. They experience long exposure to air, extreme temperature fluctuations, high desiccation risk, and variable salinity (rainfall dilution vs. evaporation concentration). Only a few highly tolerant species survive here (e.g., channeled wrack, lichens, periwinkles).

• **Middle shore:** Covered and uncovered by the tide twice daily. Organisms experience moderate exposure, temperature variation, and desiccation. Species diversity is higher than the upper shore (e.g., bladder wrack, limpets, mussels, barnacles).

• **Lower shore:** Exposed to air only briefly at low tide. Conditions are more stable — temperature, salinity, and moisture remain relatively constant. Species diversity is highest here (e.g., serrated wrack, sea anemones, kelp, sea urchins, starfish).

**Key pattern:** Species diversity generally **increases** from the upper to the lower shore because conditions become more stable and less stressful. Upper shore species must be tolerant of extreme, variable conditions. Lower shore species benefit from a more marine, stable environment but must compete with a greater number of species.

The distribution of barnacle species illustrates zonation clearly — different species of barnacles occupy distinct zones on the shore, with their upper and lower limits set by a combination of:
• **Abiotic factors** (desiccation, temperature) — which set the upper limit
• **Biotic factors** (competition, predation) — which often set the lower limit`,
    es: `Los **gráficos de cometa** (también llamados diagramas de cometa) son un tipo especializado de gráfico usado para mostrar la distribución y abundancia de especies a lo largo de un transecto. Son particularmente útiles para mostrar cómo múltiples especies se distribuyen a través de un gradiente ambiental, como una costa rocosa.

En un gráfico de cometa:
• El **eje x** muestra la posición a lo largo del transecto (ej., distancia desde la marca de marea baja, o altura sobre el nivel del mar)
• Cada especie tiene su propia banda horizontal
• El **ancho de la cometa** en cualquier punto representa la abundancia de esa especie en esa posición — más ancho = más abundante
• La cometa se dibuja simétricamente arriba y abajo de una línea central para cada especie

Los gráficos de cometa facilitan ver los **patrones de zonación** — dónde se encuentran las diferentes especies a lo largo del gradiente y cómo sus abundancias se superponen o se separan.

**Zonación de la Costa Rocosa**

Las costas rocosas proporcionan uno de los mejores ejemplos de zonación de especies a lo largo de un gradiente ambiental. Desde la costa superior hasta la costa inferior, las condiciones abióticas cambian dramáticamente:

• **Costa superior (zona de salpicadura):** Los organismos solo son salpicados por las olas en marea alta. Experimentan larga exposición al aire, fluctuaciones extremas de temperatura, alto riesgo de desecación y salinidad variable (dilución por lluvia vs. concentración por evaporación). Solo unas pocas especies altamente tolerantes sobreviven aquí (ej., fucus canaliculado, líquenes, bígaros).

• **Costa media:** Cubierta y descubierta por la marea dos veces al día. Los organismos experimentan exposición moderada, variación de temperatura y desecación. La diversidad de especies es mayor que en la costa superior (ej., fucus vesiculoso, lapas, mejillones, percebes).

• **Costa inferior:** Expuesta al aire solo brevemente durante la marea baja. Las condiciones son más estables — la temperatura, salinidad y humedad permanecen relativamente constantes. La diversidad de especies es más alta aquí (ej., fucus dentado, anémonas de mar, kelp, erizos de mar, estrellas de mar).

**Patrón clave:** La diversidad de especies generalmente **aumenta** desde la costa superior hasta la inferior porque las condiciones se vuelven más estables y menos estresantes. Las especies de la costa superior deben ser tolerantes a condiciones extremas y variables. Las especies de la costa inferior se benefician de un ambiente marino más estable pero deben competir con un mayor número de especies.

La distribución de especies de percebes ilustra claramente la zonación — diferentes especies de percebes ocupan zonas distintas en la costa, con sus límites superior e inferior establecidos por una combinación de:
• **Factores abióticos** (desecación, temperatura) — que establecen el límite superior
• **Factores bióticos** (competencia, depredación) — que a menudo establecen el límite inferior`
  },
  chunk5CC1Question: {
    en: "On a rocky shore, species diversity generally increases from the upper to the lower shore. Which of the following best explains this pattern?",
    es: "En una costa rocosa, la diversidad de especies generalmente aumenta desde la costa superior a la inferior. ¿Cuál de las siguientes opciones explica mejor este patrón?"
  },
  chunk5CC1Options: {
    en: [
      "The lower shore has more rocks for organisms to attach to",
      "The lower shore has more stable abiotic conditions with less exposure time, supporting a wider range of species",
      "Upper shore organisms are killed by predators",
      "The lower shore receives more sunlight for photosynthesis"
    ],
    es: [
      "La costa inferior tiene más rocas para que los organismos se adhieran",
      "La costa inferior tiene condiciones abióticas más estables con menos tiempo de exposición, soportando una mayor variedad de especies",
      "Los organismos de la costa superior son matados por depredadores",
      "La costa inferior recibe más luz solar para la fotosíntesis"
    ]
  },
  chunk5CC1Correct: { en: 1, es: 1 },
  chunk5CC1Explanation: {
    en: "The lower shore is submerged for longer periods, so abiotic conditions (temperature, salinity, moisture) are more stable and marine-like. This less stressful environment allows a wider range of species to survive. The upper shore has extreme and variable conditions that only a few highly tolerant species can endure.",
    es: "La costa inferior está sumergida por períodos más largos, por lo que las condiciones abióticas (temperatura, salinidad, humedad) son más estables y más marinas. Este ambiente menos estresante permite que una mayor variedad de especies sobrevivan. La costa superior tiene condiciones extremas y variables que solo unas pocas especies altamente tolerantes pueden soportar."
  },

  // ─── CHUNK 6: Correlation & Pearson's r ────────────────────────
  chunk6Title: { en: "Correlation & Pearson's Coefficient", es: "Correlación y Coeficiente de Pearson" },
  chunk6Content: {
    en: `In ecology, we often want to know whether two variables are related — for example, does the abundance of a species change with distance from the shore, or does plant cover increase with soil moisture? **Correlation analysis** helps us answer these questions.

**Types of correlation:**

• **Positive correlation** — as one variable increases, the other also increases (e.g., as soil moisture increases, plant cover increases). On a scatter plot, points trend upward from left to right.
• **Negative correlation** — as one variable increases, the other decreases (e.g., as altitude increases, temperature decreases). On a scatter plot, points trend downward from left to right.
• **No correlation** — there is no consistent relationship between the variables. Points are scattered randomly with no clear trend.

**Scatter plots** are the first step in correlation analysis. By plotting data points for two variables, you can visually assess whether a relationship exists and whether it appears to be positive, negative, or absent.

**Pearson's Correlation Coefficient (r)**

Pearson's r is a statistical measure that quantifies the strength and direction of a linear correlation between two variables. It is calculated using the formula:

**r = (Σxy − n·x̄·ȳ) / (n·Sx·Sy)**

Where:
• Σxy = the sum of the products of each paired x and y value
• n = the number of data pairs
• x̄ = the mean of the x values
• ȳ = the mean of the y values
• Sx = the standard deviation of the x values
• Sy = the standard deviation of the y values

**Interpreting Pearson's r:**
• r = +1.0 → perfect positive correlation
• r = -1.0 → perfect negative correlation
• r = 0 → no linear correlation
• |r| > 0.7 → strong correlation
• 0.4 < |r| < 0.7 → moderate correlation
• |r| < 0.4 → weak correlation

**Important:** Correlation does NOT prove causation. Even a strong correlation between two variables does not mean that one causes the other. There may be a third (confounding) variable, the relationship may be coincidental, or the direction of cause may be unclear. For example, there may be a strong correlation between ice cream sales and drowning rates — but ice cream does not cause drowning. Both are influenced by a third variable: hot weather.

In ecological investigations, finding a strong correlation between an abiotic factor and species distribution suggests a relationship worth investigating further, but experimental evidence is needed to establish a causal link.`,
    es: `En ecología, a menudo queremos saber si dos variables están relacionadas — por ejemplo, ¿cambia la abundancia de una especie con la distancia de la costa, o aumenta la cobertura vegetal con la humedad del suelo? El **análisis de correlación** nos ayuda a responder estas preguntas.

**Tipos de correlación:**

• **Correlación positiva** — a medida que una variable aumenta, la otra también aumenta (ej., a medida que aumenta la humedad del suelo, aumenta la cobertura vegetal). En un diagrama de dispersión, los puntos tienden hacia arriba de izquierda a derecha.
• **Correlación negativa** — a medida que una variable aumenta, la otra disminuye (ej., a medida que aumenta la altitud, disminuye la temperatura). En un diagrama de dispersión, los puntos tienden hacia abajo de izquierda a derecha.
• **Sin correlación** — no hay relación consistente entre las variables. Los puntos están dispersos aleatoriamente sin tendencia clara.

Los **diagramas de dispersión** son el primer paso en el análisis de correlación. Al graficar puntos de datos para dos variables, puedes evaluar visualmente si existe una relación y si parece ser positiva, negativa o ausente.

**Coeficiente de Correlación de Pearson (r)**

El r de Pearson es una medida estadística que cuantifica la fuerza y dirección de una correlación lineal entre dos variables. Se calcula usando la fórmula:

**r = (Σxy − n·x̄·ȳ) / (n·Sx·Sy)**

Donde:
• Σxy = la suma de los productos de cada par de valores x e y
• n = el número de pares de datos
• x̄ = la media de los valores x
• ȳ = la media de los valores y
• Sx = la desviación estándar de los valores x
• Sy = la desviación estándar de los valores y

**Interpretación del r de Pearson:**
• r = +1.0 → correlación positiva perfecta
• r = -1.0 → correlación negativa perfecta
• r = 0 → sin correlación lineal
• |r| > 0.7 → correlación fuerte
• 0.4 < |r| < 0.7 → correlación moderada
• |r| < 0.4 → correlación débil

**Importante:** La correlación NO prueba causalidad. Incluso una correlación fuerte entre dos variables no significa que una cause la otra. Puede haber una tercera variable (de confusión), la relación puede ser coincidente, o la dirección de la causa puede ser incierta. Por ejemplo, puede haber una correlación fuerte entre las ventas de helado y las tasas de ahogamiento — pero el helado no causa ahogamiento. Ambos están influenciados por una tercera variable: el clima caluroso.

En investigaciones ecológicas, encontrar una correlación fuerte entre un factor abiótico y la distribución de especies sugiere una relación que vale la pena investigar más, pero se necesita evidencia experimental para establecer un vínculo causal.`
  },
  chunk6CC1Question: {
    en: "A student calculates a Pearson's r value of -0.85 for the relationship between altitude and average temperature. Interpret this result and state one limitation of this finding.",
    es: "Un estudiante calcula un valor de r de Pearson de -0.85 para la relación entre la altitud y la temperatura promedio. Interpreta este resultado y establece una limitación de este hallazgo."
  },
  chunk6CC1Answer: {
    en: "The r value of -0.85 indicates a strong negative correlation between altitude and temperature — as altitude increases, temperature tends to decrease. The negative sign shows the variables move in opposite directions, and the magnitude (0.85) indicates the relationship is strong (>0.7). However, a limitation is that correlation does not prove causation. Although the relationship is strong, there may be other confounding variables (such as wind exposure, latitude, or cloud cover) that also influence temperature at different altitudes.",
    es: "El valor de r de -0.85 indica una correlación negativa fuerte entre la altitud y la temperatura — a medida que aumenta la altitud, la temperatura tiende a disminuir. El signo negativo muestra que las variables se mueven en direcciones opuestas, y la magnitud (0.85) indica que la relación es fuerte (>0.7). Sin embargo, una limitación es que la correlación no prueba causalidad. Aunque la relación es fuerte, puede haber otras variables de confusión (como la exposición al viento, la latitud o la cobertura de nubes) que también influyen en la temperatura a diferentes altitudes."
  },

  // ─── CHALLENGE QUESTIONS ───────────────────────────────────────
  challengeQ1: {
    en: "Distinguish clearly between a habitat and an ecosystem. Use a named example to illustrate how a single area can be described as both a habitat and an ecosystem.",
    es: "Distingue claramente entre un hábitat y un ecosistema. Usa un ejemplo nombrado para ilustrar cómo una sola área puede describirse tanto como un hábitat como un ecosistema."
  },
  challengeA1: {
    en: "A habitat is the physical environment in which an organism or population lives, defined by its abiotic and biotic conditions. An ecosystem includes the habitat plus all the interactions between living organisms (biotic community) and the non-living (abiotic) environment, including energy flow and nutrient cycling. For example, a coral reef is a habitat — it is the physical place where many marine species live. It is also an ecosystem because it includes all the feeding relationships (food webs), symbioses (coral-zooxanthellae mutualism), competition for space, decomposition, and nutrient cycling that occur within it. The distinction is that 'habitat' emphasizes location, while 'ecosystem' emphasizes interactions and processes.",
    es: "Un hábitat es el ambiente físico en el que vive un organismo o población, definido por sus condiciones abióticas y bióticas. Un ecosistema incluye el hábitat más todas las interacciones entre los organismos vivos (comunidad biótica) y el ambiente no vivo (abiótico), incluyendo el flujo de energía y el reciclaje de nutrientes. Por ejemplo, un arrecife de coral es un hábitat — es el lugar físico donde viven muchas especies marinas. También es un ecosistema porque incluye todas las relaciones alimentarias (redes alimentarias), simbiosis (mutualismo coral-zooxantelas), competencia por espacio, descomposición y reciclaje de nutrientes que ocurren dentro de él. La distinción es que 'hábitat' enfatiza la ubicación, mientras que 'ecosistema' enfatiza las interacciones y procesos."
  },
  challengeQ2: {
    en: "Describe four structural adaptations of xerophytes and explain the mechanism by which each reduces water loss.",
    es: "Describe cuatro adaptaciones estructurales de las xerófitas y explica el mecanismo por el cual cada una reduce la pérdida de agua."
  },
  challengeA2: {
    en: "1) Thick, waxy cuticle — forms a waterproof barrier over the leaf epidermis, reducing evaporation of water directly from the leaf surface. 2) Sunken stomata — stomata are located in pits below the leaf surface, trapping a layer of moist, still air that reduces the water potential gradient and slows transpiration. 3) Rolled leaves — leaves curl inward to enclose stomata within a humid microenvironment, reducing exposure to dry air and lowering the rate of water loss. 4) Reduced leaves/spines — minimizes the total surface area from which water can evaporate; photosynthesis is transferred to the green stem instead. Each adaptation targets the mechanisms of transpiration (evaporation, diffusion through stomata, or surface area) to conserve water in arid conditions.",
    es: "1) Cutícula gruesa y cerosa — forma una barrera impermeable sobre la epidermis de la hoja, reduciendo la evaporación de agua directamente desde la superficie de la hoja. 2) Estomas hundidos — los estomas están ubicados en fosas debajo de la superficie de la hoja, atrapando una capa de aire húmedo y quieto que reduce el gradiente de potencial hídrico y disminuye la transpiración. 3) Hojas enrolladas — las hojas se enrollan hacia adentro para encerrar los estomas dentro de un microambiente húmedo, reduciendo la exposición al aire seco y disminuyendo la tasa de pérdida de agua. 4) Hojas reducidas/espinas — minimiza el área superficial total desde la cual puede evaporarse agua; la fotosíntesis se transfiere al tallo verde. Cada adaptación apunta a los mecanismos de transpiración (evaporación, difusión a través de estomas, o área superficial) para conservar agua en condiciones áridas."
  },
  challengeQ3: {
    en: "Explain three adaptations of mangroves that allow them to survive in coastal tidal environments with high salt concentrations and waterlogged, anaerobic mud.",
    es: "Explica tres adaptaciones de los manglares que les permiten sobrevivir en ambientes costeros de mareas con altas concentraciones de sal y lodo saturado de agua y anaeróbico."
  },
  challengeA3: {
    en: "1) Pneumatophores — specialized aerial roots that grow upward out of the waterlogged mud. They have small pores (lenticels) that allow oxygen to diffuse into the root system, overcoming the problem of anaerobic mud where normal root respiration is impossible. 2) Salt-excreting glands — located on the leaves, these glands actively transport excess salt out of the plant tissues and secrete it onto the leaf surface, where it crystallizes and is washed away by rain or wind. This prevents toxic salt accumulation in cells. 3) Prop roots (stilt roots) — aerial roots extending from the trunk into the mud, providing physical support and stability in the soft, shifting substrate typical of tidal zones. They also increase the surface area for gas exchange and nutrient absorption.",
    es: "1) Neumatóforos — raíces aéreas especializadas que crecen hacia arriba fuera del lodo saturado. Tienen pequeños poros (lenticelas) que permiten que el oxígeno difunda hacia el sistema radicular, superando el problema del lodo anaeróbico donde la respiración normal de las raíces es imposible. 2) Glándulas excretoras de sal — ubicadas en las hojas, estas glándulas transportan activamente el exceso de sal fuera de los tejidos vegetales y la secretan sobre la superficie de la hoja, donde cristaliza y es lavada por la lluvia o el viento. Esto previene la acumulación tóxica de sal en las células. 3) Raíces de soporte (raíces zanco) — raíces aéreas que se extienden desde el tronco hasta el lodo, proporcionando soporte físico y estabilidad en el sustrato blando y cambiante típico de las zonas de mareas. También aumentan el área superficial para el intercambio gaseoso y la absorción de nutrientes."
  },
  challengeQ4: {
    en: "Draw and label a tolerance curve for a hypothetical organism. On your diagram, identify the optimal range, zones of stress, and limits of tolerance. Explain how this curve helps predict where the organism would be most abundant in a natural environment.",
    es: "Dibuja y etiqueta una curva de tolerancia para un organismo hipotético. En tu diagrama, identifica el rango óptimo, las zonas de estrés y los límites de tolerancia. Explica cómo esta curva ayuda a predecir dónde sería más abundante el organismo en un ambiente natural."
  },
  challengeA4: {
    en: "The tolerance curve is a bell-shaped graph with the abiotic factor (e.g., temperature) on the x-axis and organism performance/abundance on the y-axis. The peak of the curve represents the optimal range — where growth, reproduction, and survival are highest. On either side of the optimal range are the zones of stress, where the organism can survive but with reduced performance. At the extreme edges are the limits of tolerance — beyond these points, the factor becomes lethal. This curve predicts distribution because organisms will be most abundant in habitats where conditions match their optimal range. Populations will be smaller and less productive in areas where conditions fall within the zones of stress. The organism will be absent from areas where conditions exceed its limits of tolerance. For example, a fish with an optimal temperature of 20°C will be most abundant in waters near 20°C and absent from waters below 5°C or above 35°C.",
    es: "La curva de tolerancia es un gráfico en forma de campana con el factor abiótico (ej., temperatura) en el eje x y el rendimiento/abundancia del organismo en el eje y. El pico de la curva representa el rango óptimo — donde el crecimiento, la reproducción y la supervivencia son más altos. A cada lado del rango óptimo están las zonas de estrés, donde el organismo puede sobrevivir pero con rendimiento reducido. En los bordes extremos están los límites de tolerancia — más allá de estos puntos, el factor se vuelve letal. Esta curva predice la distribución porque los organismos serán más abundantes en hábitats donde las condiciones coinciden con su rango óptimo. Las poblaciones serán más pequeñas y menos productivas en áreas donde las condiciones caen dentro de las zonas de estrés. El organismo estará ausente de áreas donde las condiciones excedan sus límites de tolerancia."
  },
  challengeQ5: {
    en: "Compare the advantages and disadvantages of using a continuous belt transect versus an interrupted belt transect when studying species distribution along a rocky shore.",
    es: "Compara las ventajas y desventajas de usar un transecto de banda continuo versus un transecto de banda interrumpido al estudiar la distribución de especies a lo largo de una costa rocosa."
  },
  challengeA5: {
    en: "Continuous belt transect: Advantage — provides the most complete and detailed data, as every organism within the belt is recorded across the entire gradient. This means no species or patterns are missed. Disadvantage — extremely time-consuming and labor-intensive, especially over long distances, making it impractical for large study areas. Interrupted belt transect: Advantage — much faster and more practical, as only quadrats at set intervals are sampled. It still captures the general pattern of species change along the gradient while requiring significantly less effort. Disadvantage — may miss localized patches of species between sampling points, potentially underestimating the presence of patchily distributed organisms. The interrupted belt transect is generally the preferred method for most rocky shore studies because it provides a good balance between data quality and practical effort.",
    es: "Transecto de banda continuo: Ventaja — proporciona los datos más completos y detallados, ya que cada organismo dentro de la banda se registra a lo largo de todo el gradiente. Esto significa que no se pierden especies ni patrones. Desventaja — extremadamente laborioso y consume mucho tiempo, especialmente en distancias largas, haciéndolo impráctico para áreas de estudio grandes. Transecto de banda interrumpido: Ventaja — mucho más rápido y práctico, ya que solo se muestrean cuadrantes a intervalos establecidos. Aún captura el patrón general de cambio de especies a lo largo del gradiente mientras requiere significativamente menos esfuerzo. Desventaja — puede perder parches localizados de especies entre los puntos de muestreo, potencialmente subestimando la presencia de organismos distribuidos de forma irregular. El transecto de banda interrumpido es generalmente el método preferido para la mayoría de los estudios de costas rocosas porque proporciona un buen equilibrio entre la calidad de los datos y el esfuerzo práctico."
  },
  challengeQ6: {
    en: "Using the concept of kite graphs, describe how you would present data showing the distribution of four barnacle species across a rocky shore transect. Explain what patterns you might expect to see and why.",
    es: "Usando el concepto de gráficos de cometa, describe cómo presentarías datos que muestren la distribución de cuatro especies de percebes a lo largo de un transecto de costa rocosa. Explica qué patrones esperarías ver y por qué."
  },
  challengeA6: {
    en: "A kite graph would have position along the shore (distance from low-tide mark or height above sea level) on the x-axis. Each of the four barnacle species would have its own horizontal band, stacked vertically. At each sampling position, the width of the kite represents the abundance of that species — wider sections indicate greater numbers. Expected patterns: Each species would occupy a distinct zone on the shore with some overlap. Upper-shore species (e.g., Chthamalus) would have wider kites in the upper zones and taper off lower. Lower-shore species (e.g., Semibalanus) would be wider in lower zones. The upper limit of each species is typically set by abiotic factors (desiccation tolerance), while the lower limit is often set by biotic factors (competition from species better adapted to that zone). The overall pattern shows clear zonation — different species dominating at different heights on the shore.",
    es: "Un gráfico de cometa tendría la posición a lo largo de la costa (distancia desde la marca de marea baja o altura sobre el nivel del mar) en el eje x. Cada una de las cuatro especies de percebes tendría su propia banda horizontal, apilada verticalmente. En cada posición de muestreo, el ancho de la cometa representa la abundancia de esa especie — secciones más anchas indican mayores números. Patrones esperados: Cada especie ocuparía una zona distinta en la costa con algo de superposición. Las especies de la costa superior (ej., Chthamalus) tendrían cometas más anchos en las zonas superiores y se estrecharían más abajo. Las especies de la costa inferior (ej., Semibalanus) serían más anchos en zonas inferiores. El límite superior de cada especie está típicamente establecido por factores abióticos (tolerancia a la desecación), mientras que el límite inferior a menudo está establecido por factores bióticos (competencia de especies mejor adaptadas a esa zona). El patrón general muestra zonación clara — diferentes especies dominando a diferentes alturas de la costa."
  },
  challengeQ7: {
    en: "Explain how changes in abiotic factors from the upper shore to the lower shore of a rocky coastline influence the distribution and diversity of organisms found in each zone.",
    es: "Explica cómo los cambios en los factores abióticos desde la costa superior hasta la costa inferior de una línea costera rocosa influyen en la distribución y diversidad de organismos encontrados en cada zona."
  },
  challengeA7: {
    en: "The upper shore is exposed to air for long periods, experiencing extreme temperature fluctuations (heating by sun, cooling at night), high desiccation risk from wind and sun, and variable salinity (diluted by rain, concentrated by evaporation). Only organisms with wide tolerance ranges for these stresses can survive — so species diversity is low and dominated by hardy organisms like lichens, channeled wrack, and small periwinkles. The middle shore is covered and uncovered by tides twice daily, creating moderate but fluctuating conditions. This intermediate environment supports more species than the upper shore, including barnacles, limpets, mussels, and several seaweed species, as the regular immersion reduces desiccation and temperature stress. The lower shore is submerged almost continuously, exposed to air only briefly at low tide. Conditions are stable and marine — temperature, salinity, and moisture levels remain relatively constant. This stability allows the greatest diversity of species, including delicate organisms like sea anemones, starfish, sea urchins, and large kelp species that cannot tolerate drying out. The key principle is that environmental stability increases toward the lower shore, and greater stability supports greater species diversity because fewer species are excluded by abiotic stress.",
    es: "La costa superior está expuesta al aire por largos períodos, experimentando fluctuaciones extremas de temperatura (calentamiento por el sol, enfriamiento por la noche), alto riesgo de desecación por el viento y el sol, y salinidad variable (diluida por la lluvia, concentrada por la evaporación). Solo los organismos con amplios rangos de tolerancia para estos estreses pueden sobrevivir — por lo que la diversidad de especies es baja y dominada por organismos resistentes como líquenes, fucus canaliculado y bígaros pequeños. La costa media es cubierta y descubierta por las mareas dos veces al día, creando condiciones moderadas pero fluctuantes. Este ambiente intermedio soporta más especies que la costa superior, incluyendo percebes, lapas, mejillones y varias especies de algas, ya que la inmersión regular reduce la desecación y el estrés térmico. La costa inferior está sumergida casi continuamente, expuesta al aire solo brevemente durante la marea baja. Las condiciones son estables y marinas — la temperatura, salinidad y niveles de humedad permanecen relativamente constantes. Esta estabilidad permite la mayor diversidad de especies, incluyendo organismos delicados como anémonas de mar, estrellas de mar, erizos de mar y grandes especies de kelp que no pueden tolerar la desecación. El principio clave es que la estabilidad ambiental aumenta hacia la costa inferior, y mayor estabilidad soporta mayor diversidad de especies porque menos especies son excluidas por el estrés abiótico."
  },
  challengeQ8: {
    en: "Distinguish between positive correlation, negative correlation, and no correlation. For each type, give one ecological example.",
    es: "Distingue entre correlación positiva, correlación negativa y sin correlación. Para cada tipo, da un ejemplo ecológico."
  },
  challengeA8: {
    en: "Positive correlation: as one variable increases, the other also increases. Example: as soil moisture increases, the percentage cover of moss increases — wetter soil supports more moss growth. Negative correlation: as one variable increases, the other decreases. Example: as altitude increases, the average temperature decreases — higher altitudes are colder due to reduced atmospheric pressure and thinner air. No correlation: there is no consistent pattern between the two variables. Example: the number of limpets on a rocky shore shows no relationship with wind direction — limpet distribution is determined by other factors such as wave exposure and food availability, not wind direction. It is important to note that even strong correlations do not prove that one variable causes changes in the other — a third confounding variable may be responsible.",
    es: "Correlación positiva: a medida que una variable aumenta, la otra también aumenta. Ejemplo: a medida que aumenta la humedad del suelo, aumenta el porcentaje de cobertura de musgo — el suelo más húmedo soporta más crecimiento de musgo. Correlación negativa: a medida que una variable aumenta, la otra disminuye. Ejemplo: a medida que aumenta la altitud, la temperatura promedio disminuye — las altitudes más altas son más frías debido a la menor presión atmosférica y el aire más delgado. Sin correlación: no hay un patrón consistente entre las dos variables. Ejemplo: el número de lapas en una costa rocosa no muestra relación con la dirección del viento — la distribución de lapas está determinada por otros factores como la exposición a las olas y la disponibilidad de alimento, no la dirección del viento. Es importante notar que incluso las correlaciones fuertes no prueban que una variable cause cambios en la otra — una tercera variable de confusión puede ser responsable."
  },
  challengeQ9: {
    en: "A student collected the following data on distance from shore (m) and number of limpets per quadrat:\n\nDistance: 2, 4, 6, 8, 10\nLimpets: 45, 38, 25, 15, 8\n\nThe means are x̄ = 6.0 and ȳ = 26.2. The standard deviations are Sx = 3.16 and Sy = 15.21. Σxy = 586.\n\nCalculate Pearson's r and interpret the result.",
    es: "Un estudiante recopiló los siguientes datos sobre la distancia desde la costa (m) y el número de lapas por cuadrante:\n\nDistancia: 2, 4, 6, 8, 10\nLapas: 45, 38, 25, 15, 8\n\nLas medias son x̄ = 6.0 y ȳ = 26.2. Las desviaciones estándar son Sx = 3.16 y Sy = 15.21. Σxy = 586.\n\nCalcula el r de Pearson e interpreta el resultado."
  },
  challengeA9: {
    en: "Using the formula r = (Σxy − n·x̄·ȳ) / (n·Sx·Sy):\n\nr = (586 − 5 × 6.0 × 26.2) / (5 × 3.16 × 15.21)\nr = (586 − 786) / (240.32)\nr = −200 / 240.32\nr = −0.83\n\nInterpretation: The Pearson's r value of −0.83 indicates a strong negative correlation between distance from shore and number of limpets. As the distance from shore increases, the number of limpets decreases significantly. The magnitude (0.83 > 0.7) indicates the relationship is strong. However, this correlation does not prove that distance directly causes the decrease in limpets — the actual cause may be related to abiotic factors that change with distance, such as exposure time, wave action, or moisture availability.",
    es: "Usando la fórmula r = (Σxy − n·x̄·ȳ) / (n·Sx·Sy):\n\nr = (586 − 5 × 6.0 × 26.2) / (5 × 3.16 × 15.21)\nr = (586 − 786) / (240.32)\nr = −200 / 240.32\nr = −0.83\n\nInterpretación: El valor de r de Pearson de −0.83 indica una correlación negativa fuerte entre la distancia desde la costa y el número de lapas. A medida que la distancia desde la costa aumenta, el número de lapas disminuye significativamente. La magnitud (0.83 > 0.7) indica que la relación es fuerte. Sin embargo, esta correlación no prueba que la distancia cause directamente la disminución de lapas — la causa real puede estar relacionada con factores abióticos que cambian con la distancia, como el tiempo de exposición, la acción de las olas o la disponibilidad de humedad."
  },
  challengeQ10: {
    en: "A researcher finds a Pearson's r value of +0.92 between fertilizer concentration in agricultural runoff and algal bloom density in a nearby lake. Evaluate this finding: does this prove the fertilizer causes algal blooms? Explain your reasoning.",
    es: "Un investigador encuentra un valor de r de Pearson de +0.92 entre la concentración de fertilizante en la escorrentía agrícola y la densidad de floraciones de algas en un lago cercano. Evalúa este hallazgo: ¿prueba esto que el fertilizante causa las floraciones de algas? Explica tu razonamiento."
  },
  challengeA10: {
    en: "The Pearson's r of +0.92 indicates a very strong positive correlation — as fertilizer concentration increases, algal bloom density also increases. However, correlation alone does not prove causation. While the biological mechanism is well understood (excess nitrogen and phosphorus from fertilizers promote rapid algal growth through eutrophication), several factors must be considered: (1) There could be confounding variables — seasonal temperature changes, natural nutrient inputs, or sewage discharge might also contribute. (2) The direction of causation could theoretically be questioned, though in this case the mechanism is clear. (3) To establish causation, the researcher would need controlled experiments (e.g., adding known fertilizer concentrations to mesocosms and measuring algal response) or would need to account for all potential confounding variables. That said, the strong correlation combined with the known biological mechanism (nutrients stimulate algal growth) provides compelling evidence that fertilizer runoff is a significant contributing factor to the algal blooms. This is a case where correlation, mechanism, and dose-response relationship together support a causal link.",
    es: "El r de Pearson de +0.92 indica una correlación positiva muy fuerte — a medida que aumenta la concentración de fertilizante, la densidad de floraciones de algas también aumenta. Sin embargo, la correlación sola no prueba causalidad. Aunque el mecanismo biológico es bien entendido (el exceso de nitrógeno y fósforo de los fertilizantes promueve el crecimiento rápido de algas a través de la eutrofización), se deben considerar varios factores: (1) Podría haber variables de confusión — cambios estacionales de temperatura, aportes naturales de nutrientes o descarga de aguas residuales también podrían contribuir. (2) La dirección de la causalidad teóricamente podría cuestionarse, aunque en este caso el mecanismo es claro. (3) Para establecer causalidad, el investigador necesitaría experimentos controlados (ej., agregar concentraciones conocidas de fertilizante a mesocosmos y medir la respuesta de las algas) o tendría que controlar todas las posibles variables de confusión. Dicho esto, la correlación fuerte combinada con el mecanismo biológico conocido (los nutrientes estimulan el crecimiento de algas) proporciona evidencia convincente de que la escorrentía de fertilizantes es un factor contribuyente significativo a las floraciones de algas. Este es un caso donde la correlación, el mecanismo y la relación dosis-respuesta juntos apoyan un vínculo causal."
  },

  // Interactive labels
  toleranceExplorer: { en: "Tolerance Range Explorer", es: "Explorador de Rangos de Tolerancia" },
  toleranceOrganism: { en: "Organism type", es: "Tipo de organismo" },
  toleranceSpecialist: { en: "Specialist (narrow range)", es: "Especialista (rango estrecho)" },
  toleranceGeneralist: { en: "Generalist (broad range)", es: "Generalista (rango amplio)" },
  toleranceTemp: { en: "Current Temperature", es: "Temperatura Actual" },
  toleranceOptimal: { en: "Optimal conditions — organism thrives", es: "Condiciones óptimas — el organismo prospera" },
  toleranceStress: { en: "Zone of stress — organism survives with reduced performance", es: "Zona de estrés — el organismo sobrevive con rendimiento reducido" },
  toleranceLethal: { en: "Beyond tolerance limits — organism cannot survive", es: "Más allá de los límites de tolerancia — el organismo no puede sobrevivir" },
  tolerancePerformance: { en: "Performance / Abundance", es: "Rendimiento / Abundancia" },
  toleranceTempLabel: { en: "Temperature (°C)", es: "Temperatura (°C)" },

  transectTitle: { en: "Rocky Shore Transect Simulator", es: "Simulador de Transecto de Costa Rocosa" },
  transectSample: { en: "Sample", es: "Muestrear" },
  transectSpecies: { en: "Species", es: "Especie" },
  transectPresent: { en: "Present", es: "Presente" },
  transectAbsent: { en: "Absent", es: "Ausente" },
  transectInstruction: { en: "Click each zone to sample the organisms found there:", es: "Haz clic en cada zona para muestrear los organismos encontrados allí:" },

  kiteTitle: { en: "Shore Zonation — Species Distribution", es: "Zonación Costera — Distribución de Especies" },
  kiteToggle: { en: "Toggle species:", es: "Alternar especies:" },
  kitePosition: { en: "Shore Height (m above low tide)", es: "Altura de la Costa (m sobre marea baja)" },
  kiteAbundance: { en: "Relative Abundance", es: "Abundancia Relativa" },

  correlationTitle: { en: "Correlation Explorer & Pearson's r Calculator", es: "Explorador de Correlación y Calculadora de r de Pearson" },
  correlationDataset: { en: "Select dataset:", es: "Seleccionar conjunto de datos:" },
  correlationStrength: { en: "Correlation Strength", es: "Fuerza de Correlación" },
  correlationStrong: { en: "Strong", es: "Fuerte" },
  correlationModerate: { en: "Moderate", es: "Moderada" },
  correlationWeak: { en: "Weak", es: "Débil" },
  correlationPositive: { en: "Positive", es: "Positiva" },
  correlationNegative: { en: "Negative", es: "Negativa" },
  correlationNone: { en: "None", es: "Ninguna" },
};

// ═══════════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════════
const t = (key, lang) => {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
};

// ═══════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Renders markdown-light text with **bold** support
const ContentRenderer = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div className="whitespace-pre-line leading-relaxed text-gray-700">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
};

// MCQ concept check
const ConceptCheckMCQ = ({ question, options, correctIndex, explanation, lang }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="concept-check-box">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <span className="font-bold text-amber-800">{t('conceptCheck', lang)}</span>
      </div>
      <p className="text-gray-800 font-medium mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let cls = "p-3 rounded-lg border cursor-pointer transition-all ";
          if (!submitted) {
            cls += selected === i ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white hover:border-brand-300";
          } else if (i === correctIndex) {
            cls += "border-green-500 bg-green-50";
          } else if (i === selected) {
            cls += "border-red-400 bg-red-50";
          } else {
            cls += "border-gray-200 bg-white opacity-60";
          }
          return (
            <div key={i} className={cls} onClick={() => !submitted && setSelected(i)}>
              <div className="flex items-center gap-2">
                {submitted && i === correctIndex && <Check className="w-4 h-4 text-green-600" />}
                {submitted && i === selected && i !== correctIndex && <X className="w-4 h-4 text-red-500" />}
                <span className="text-sm">{opt}</span>
              </div>
            </div>
          );
        })}
      </div>
      {!submitted ? (
        <button
          disabled={selected === null}
          onClick={() => setSubmitted(true)}
          className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-amber-600 transition"
        >
          {t('checkAnswer', lang)}
        </button>
      ) : (
        <div className={`mt-3 p-3 rounded-lg text-sm ${selected === correctIndex ? "bg-green-100 text-green-800" : "bg-red-50 text-red-800"}`}>
          <p className="font-bold mb-1">{selected === correctIndex ? t('correct', lang) : t('incorrect', lang)}</p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

// Short-answer concept check
const ConceptCheckShortAnswer = ({ question, answer, lang }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="concept-check-box">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <span className="font-bold text-amber-800">{t('conceptCheck', lang)}</span>
      </div>
      <p className="text-gray-800 font-medium mb-3">{question}</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition">
          {t('revealAnswer', lang)}
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
          <ContentRenderer text={answer} />
        </div>
      )}
    </div>
  );
};

// Challenge question
const ChallengeQuestion = ({ number, question, marks, difficulty, response, onChange, modelAnswer, lang }) => {
  const [revealed, setRevealed] = useState(false);
  const diffColors = { Easy: "text-green-700 bg-green-50 border-green-200", Medium: "text-amber-700 bg-amber-50 border-amber-200", Hard: "text-red-700 bg-red-50 border-red-200" };
  const diffLabels = { Easy: { en: "Easy", es: "Fácil" }, Medium: { en: "Medium", es: "Medio" }, Hard: { en: "Hard", es: "Difícil" } };

  return (
    <div className="challenge-card">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-bold text-gray-800">{t('question', lang)} {number}</span>
        <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${diffColors[difficulty]}`}>{diffLabels[difficulty][lang]}</span>
        <span className="text-xs px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700 font-semibold">{marks} {t('marks', lang)}</span>
      </div>
      <div className="mb-3 text-gray-700"><ContentRenderer text={question} /></div>
      <textarea
        className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none"
        placeholder={t('yourAnswer', lang)}
        value={response || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="mt-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition">
          {t('revealModel', lang)}
        </button>
      ) : (
        <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs font-bold text-green-700 mb-1">{t('modelAnswer', lang)}</p>
          <div className="text-sm text-green-800"><ContentRenderer text={modelAnswer} /></div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// INTERACTIVE 1: Tolerance Range Explorer
// ═══════════════════════════════════════════════════════════════════
const ToleranceRangeExplorer = ({ lang }) => {
  const [temp, setTemp] = useState(25);
  const [orgType, setOrgType] = useState('specialist');

  const params = orgType === 'specialist'
    ? { mean: 25, sd: 4, min: 10, max: 40, optLow: 21, optHigh: 29 }
    : { mean: 25, sd: 10, min: 0, max: 50, optLow: 18, optHigh: 32 };

  const data = useMemo(() => {
    const pts = [];
    for (let x = params.min; x <= params.max; x += 0.5) {
      const val = Math.exp(-0.5 * Math.pow((x - params.mean) / params.sd, 2));
      pts.push({
        temp: x,
        optimal: (x >= params.optLow && x <= params.optHigh) ? val * 100 : null,
        stress: ((x >= params.min + 2 && x < params.optLow) || (x > params.optHigh && x <= params.max - 2)) ? val * 100 : null,
        lethal: (x < params.min + 2 || x > params.max - 2) ? val * 100 : null,
      });
    }
    return pts;
  }, [orgType]);

  const getStatus = () => {
    if (temp >= params.optLow && temp <= params.optHigh) return { text: t('toleranceOptimal', lang), color: 'text-green-700 bg-green-50' };
    if (temp >= params.min + 2 && temp <= params.max - 2) return { text: t('toleranceStress', lang), color: 'text-amber-700 bg-amber-50' };
    return { text: t('toleranceLethal', lang), color: 'text-red-700 bg-red-50' };
  };
  const status = getStatus();

  return (
    <div className="interactive-box">
      <div className="flex items-center gap-2 mb-3">
        <Thermometer className="w-5 h-5 text-brand-600" />
        <span className="font-bold text-brand-800">{t('toleranceExplorer', lang)}</span>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">{t('toleranceOrganism', lang)}</label>
          <div className="flex gap-2">
            {['specialist', 'generalist'].map(type => (
              <button key={type} onClick={() => setOrgType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${orgType === type ? 'bg-brand-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-brand-50'}`}>
                {type === 'specialist' ? t('toleranceSpecialist', lang) : t('toleranceGeneralist', lang)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-600 block mb-1">{t('toleranceTemp', lang)}: {temp}°C</label>
          <input type="range" min={params.min} max={params.max} step={0.5} value={temp} onChange={e => setTemp(Number(e.target.value))}
            className="w-full accent-brand-600" />
        </div>
      </div>
      <div className={`px-3 py-2 rounded-lg text-sm font-semibold mb-3 ${status.color}`}>{status.text}</div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="temp" label={{ value: t('toleranceTempLabel', lang), position: 'insideBottom', offset: -2 }} tick={{ fontSize: 11 }} />
          <YAxis label={{ value: t('tolerancePerformance', lang), angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }} tick={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="optimal" fill="#22c55e" stroke="#16a34a" fillOpacity={0.5} connectNulls={false} />
          <Area type="monotone" dataKey="stress" fill="#f59e0b" stroke="#d97706" fillOpacity={0.4} connectNulls={false} />
          <Area type="monotone" dataKey="lethal" fill="#ef4444" stroke="#dc2626" fillOpacity={0.3} connectNulls={false} />
          <ReferenceLine x={temp} stroke="#1e40af" strokeWidth={2} strokeDasharray="5 5" label={{ value: `${temp}°C`, position: 'top', fill: '#1e40af', fontSize: 12 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// INTERACTIVE 2: Rocky Shore Transect Simulator
// ═══════════════════════════════════════════════════════════════════
const zoneData = {
  splash: {
    name: { en: "Splash Zone", es: "Zona de Salpicadura" },
    color: "bg-orange-100 border-orange-300",
    species: { en: ["Lichens", "Small periwinkles", "Channeled wrack"], es: ["Líquenes", "Bígaros pequeños", "Fucus canaliculado"] }
  },
  upper: {
    name: { en: "Upper Shore", es: "Costa Superior" },
    color: "bg-amber-100 border-amber-300",
    species: { en: ["Spiral wrack", "Rough periwinkles", "Barnacles (Chthamalus)"], es: ["Fucus espiral", "Bígaros rugosos", "Percebes (Chthamalus)"] }
  },
  middle: {
    name: { en: "Middle Shore", es: "Costa Media" },
    color: "bg-yellow-100 border-yellow-300",
    species: { en: ["Bladder wrack", "Limpets", "Mussels", "Barnacles (Semibalanus)"], es: ["Fucus vesiculoso", "Lapas", "Mejillones", "Percebes (Semibalanus)"] }
  },
  lower: {
    name: { en: "Lower Shore", es: "Costa Inferior" },
    color: "bg-cyan-100 border-cyan-300",
    species: { en: ["Serrated wrack", "Sea anemones", "Starfish", "Sea urchins"], es: ["Fucus dentado", "Anémonas de mar", "Estrellas de mar", "Erizos de mar"] }
  },
  subtidal: {
    name: { en: "Subtidal Zone", es: "Zona Submareal" },
    color: "bg-blue-100 border-blue-300",
    species: { en: ["Kelp", "Sea urchins", "Crabs", "Fish", "Sponges"], es: ["Kelp", "Erizos de mar", "Cangrejos", "Peces", "Esponjas"] }
  },
};

const TransectSimulator = ({ lang }) => {
  const [sampled, setSampled] = useState({});
  const zones = Object.entries(zoneData);

  return (
    <div className="interactive-box">
      <div className="flex items-center gap-2 mb-2">
        <Beaker className="w-5 h-5 text-brand-600" />
        <span className="font-bold text-brand-800">{t('transectTitle', lang)}</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{t('transectInstruction', lang)}</p>
      <div className="space-y-2 mb-4">
        {zones.map(([key, zone]) => (
          <div key={key} className={`border rounded-lg p-3 flex items-center justify-between ${zone.color}`}>
            <div>
              <span className="font-semibold text-sm">{zone.name[lang]}</span>
              {sampled[key] && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {zone.species[lang].map((sp, i) => (
                    <span key={i} className="text-xs bg-white/70 px-2 py-0.5 rounded">{sp}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setSampled(prev => ({ ...prev, [key]: true }))}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${sampled[key] ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}>
              {sampled[key] ? <Check className="w-3 h-3" /> : t('transectSample', lang)}
            </button>
          </div>
        ))}
      </div>
      {Object.keys(sampled).length === zones.length && (
        <div className="bg-white/70 rounded-lg p-3">
          <p className="text-sm font-semibold text-brand-700 mb-2">
            {lang === 'en' ? 'All zones sampled! Notice how species diversity increases from the splash zone to the subtidal zone.' : '¡Todas las zonas muestreadas! Observa cómo la diversidad de especies aumenta desde la zona de salpicadura hasta la zona submareal.'}
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            {zones.map(([key, zone]) => (
              <div key={key} className="text-center">
                <div className="font-bold text-lg text-brand-700">{zone.species[lang].length}</div>
                <div>{zone.name[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => setSampled({})} className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-brand-600">
        <RotateCcw className="w-3 h-3" /> {t('reset', lang)}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// INTERACTIVE 3: Kite Graph — Shore Zonation
// ═══════════════════════════════════════════════════════════════════
const speciesKiteData = [
  { name: "Chthamalus", color: "#ef4444", data: [0, 0, 5, 15, 32, 55, 100, 90, 50, 18, 0] },
  { name: "Semibalanus", color: "#3b82f6", data: [0, 0, 0, 0, 10, 40, 90, 100, 60, 20, 0] },
  { name: "Patella (Limpets)", color: "#22c55e", data: [0, 5, 10, 18, 32, 55, 70, 50, 25, 8, 0] },
  { name: "Nucella (Dog whelk)", color: "#a855f7", data: [0, 0, 0, 0, 0, 8, 20, 45, 70, 40, 0] },
];
const kitePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const KiteGraphBuilder = ({ lang }) => {
  const [visible, setVisible] = useState({ Chthamalus: true, Semibalanus: true, "Patella (Limpets)": true, "Nucella (Dog whelk)": true });

  const chartData = useMemo(() => {
    return kitePositions.map((pos, i) => {
      const pt = { position: pos };
      speciesKiteData.forEach(sp => {
        if (visible[sp.name]) {
          pt[sp.name + '_upper'] = sp.data[i];
          pt[sp.name + '_lower'] = -sp.data[i];
        }
      });
      return pt;
    });
  }, [visible]);

  return (
    <div className="interactive-box">
      <div className="flex items-center gap-2 mb-2">
        <Waves className="w-5 h-5 text-brand-600" />
        <span className="font-bold text-brand-800">{t('kiteTitle', lang)}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs font-semibold text-gray-600 self-center">{t('kiteToggle', lang)}</span>
        {speciesKiteData.map(sp => (
          <button key={sp.name} onClick={() => setVisible(prev => ({ ...prev, [sp.name]: !prev[sp.name] }))}
            className={`text-xs px-2 py-1 rounded-full font-semibold border transition ${visible[sp.name] ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-300'}`}
            style={visible[sp.name] ? { backgroundColor: sp.color } : {}}>
            {sp.name}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="position" label={{ value: t('kitePosition', lang), position: 'insideBottom', offset: -2, style: { fontSize: 11 } }} tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} label={{ value: t('kiteAbundance', lang), angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }} />
          {speciesKiteData.filter(sp => visible[sp.name]).map(sp => (
            <React.Fragment key={sp.name}>
              <Area type="monotone" dataKey={sp.name + '_upper'} fill={sp.color} stroke={sp.color} fillOpacity={0.3} strokeWidth={2} />
              <Area type="monotone" dataKey={sp.name + '_lower'} fill={sp.color} stroke={sp.color} fillOpacity={0.3} strokeWidth={2} />
            </React.Fragment>
          ))}
          <Tooltip formatter={(val) => Math.abs(val)} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
        <span>← {lang === 'en' ? 'Lower Shore' : 'Costa Inferior'}</span>
        <span className="flex-1 text-center">{lang === 'en' ? 'Width = Abundance' : 'Ancho = Abundancia'}</span>
        <span>{lang === 'en' ? 'Upper Shore' : 'Costa Superior'} →</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// INTERACTIVE 4: Correlation Calculator
// ═══════════════════════════════════════════════════════════════════
const datasets = {
  limpets: {
    label: { en: "Distance from shore vs. Limpets", es: "Distancia de la costa vs. Lapas" },
    xLabel: { en: "Distance (m)", es: "Distancia (m)" },
    yLabel: { en: "Limpets per m²", es: "Lapas por m²" },
    data: [
      { x: 2, y: 45 }, { x: 4, y: 38 }, { x: 6, y: 25 }, { x: 8, y: 15 }, { x: 10, y: 8 },
      { x: 3, y: 40 }, { x: 5, y: 30 }, { x: 7, y: 20 }, { x: 9, y: 12 },
    ],
  },
  plants: {
    label: { en: "Light intensity vs. Plant cover", es: "Intensidad de luz vs. Cobertura vegetal" },
    xLabel: { en: "Light (lux)", es: "Luz (lux)" },
    yLabel: { en: "Plant cover (%)", es: "Cobertura vegetal (%)" },
    data: [
      { x: 100, y: 10 }, { x: 200, y: 20 }, { x: 350, y: 35 }, { x: 500, y: 55 }, { x: 650, y: 60 },
      { x: 800, y: 72 }, { x: 900, y: 78 }, { x: 150, y: 15 }, { x: 450, y: 45 },
    ],
  },
  altitude: {
    label: { en: "Altitude vs. Temperature", es: "Altitud vs. Temperatura" },
    xLabel: { en: "Altitude (m)", es: "Altitud (m)" },
    yLabel: { en: "Temperature (°C)", es: "Temperatura (°C)" },
    data: [
      { x: 0, y: 22 }, { x: 200, y: 20 }, { x: 400, y: 17 }, { x: 600, y: 15 }, { x: 800, y: 12 },
      { x: 1000, y: 10 }, { x: 1200, y: 7 }, { x: 1500, y: 4 }, { x: 1800, y: 1 },
    ],
  },
};

const CorrelationCalculator = ({ lang }) => {
  const [dsKey, setDsKey] = useState('limpets');
  const ds = datasets[dsKey];

  const stats = useMemo(() => {
    const d = ds.data;
    const n = d.length;
    const xVals = d.map(p => p.x);
    const yVals = d.map(p => p.y);
    const xMean = xVals.reduce((a, b) => a + b, 0) / n;
    const yMean = yVals.reduce((a, b) => a + b, 0) / n;
    const sx = Math.sqrt(xVals.reduce((acc, v) => acc + Math.pow(v - xMean, 2), 0) / n);
    const sy = Math.sqrt(yVals.reduce((acc, v) => acc + Math.pow(v - yMean, 2), 0) / n);
    const sumXY = d.reduce((acc, p) => acc + p.x * p.y, 0);
    const r = (sumXY - n * xMean * yMean) / (n * sx * sy);
    const absR = Math.abs(r);
    let strength, color;
    if (absR > 0.7) { strength = t('correlationStrong', lang); color = r > 0 ? '#22c55e' : '#ef4444'; }
    else if (absR > 0.4) { strength = t('correlationModerate', lang); color = '#f59e0b'; }
    else { strength = t('correlationWeak', lang); color = '#9ca3af'; }
    const direction = r > 0.1 ? t('correlationPositive', lang) : r < -0.1 ? t('correlationNegative', lang) : t('correlationNone', lang);
    return { n, xMean, yMean, sx, sy, sumXY, r, strength, direction, color };
  }, [dsKey, lang]);

  return (
    <div className="interactive-box">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-brand-600" />
        <span className="font-bold text-brand-800">{t('correlationTitle', lang)}</span>
      </div>
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-600 block mb-1">{t('correlationDataset', lang)}</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(datasets).map(([key, val]) => (
            <button key={key} onClick={() => setDsKey(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${dsKey === key ? 'bg-brand-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-brand-50'}`}>
              {val.label[lang]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name={ds.xLabel[lang]} label={{ value: ds.xLabel[lang], position: 'insideBottom', offset: -10, style: { fontSize: 11 } }} tick={{ fontSize: 10 }} type="number" />
            <YAxis dataKey="y" name={ds.yLabel[lang]} label={{ value: ds.yLabel[lang], angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }} tick={{ fontSize: 10 }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={ds.data} fill={stats.color} />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="bg-white/80 rounded-lg p-3 text-sm space-y-1">
          <p className="font-bold text-brand-700 mb-2">{lang === 'en' ? 'Step-by-step Calculation' : 'Cálculo Paso a Paso'}</p>
          <p><span className="font-semibold">n</span> = {stats.n}</p>
          <p><span className="font-semibold">x̄</span> = {stats.xMean.toFixed(2)}</p>
          <p><span className="font-semibold">ȳ</span> = {stats.yMean.toFixed(2)}</p>
          <p><span className="font-semibold">Sx</span> = {stats.sx.toFixed(4)}</p>
          <p><span className="font-semibold">Sy</span> = {stats.sy.toFixed(4)}</p>
          <p><span className="font-semibold">Σxy</span> = {stats.sumXY.toFixed(2)}</p>
          <hr className="my-2" />
          <p className="text-lg font-bold" style={{ color: stats.color }}>r = {stats.r.toFixed(4)}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-1 rounded-full font-bold text-white" style={{ backgroundColor: stats.color }}>{stats.strength} {stats.direction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [started, setStarted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('learn');
  const [responses, setResponses] = useState({});
  const [compiled, setCompiled] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const updateResponse = useCallback((key, val) => {
    setResponses(prev => ({ ...prev, [key]: val }));
  }, []);

  // Compile
  const handleCompile = () => {
    const divider = '═'.repeat(50);
    const subDivider = '─'.repeat(40);
    let text = `${t('compiledHeader', lang)}\n${divider}\n`;
    text += `${t('studentName', lang)}: ${studentName}\n`;
    text += `${t('language', lang)}: ${lang === 'en' ? 'English' : 'Español'}\n${divider}\n\n`;

    const questions = [
      { q: 'challengeQ1', a: 'challengeA1', marks: 4, diff: 'Medium' },
      { q: 'challengeQ2', a: 'challengeA2', marks: 4, diff: 'Medium' },
      { q: 'challengeQ3', a: 'challengeA3', marks: 3, diff: 'Medium' },
      { q: 'challengeQ4', a: 'challengeA4', marks: 4, diff: 'Medium' },
      { q: 'challengeQ5', a: 'challengeA5', marks: 3, diff: 'Easy' },
      { q: 'challengeQ6', a: 'challengeA6', marks: 4, diff: 'Medium' },
      { q: 'challengeQ7', a: 'challengeA7', marks: 4, diff: 'Hard' },
      { q: 'challengeQ8', a: 'challengeA8', marks: 3, diff: 'Medium' },
      { q: 'challengeQ9', a: 'challengeA9', marks: 4, diff: 'Hard' },
      { q: 'challengeQ10', a: 'challengeA10', marks: 3, diff: 'Medium' },
    ];

    questions.forEach((item, i) => {
      text += `${t('question', lang)} ${i + 1} [${item.marks} ${t('marks', lang)}]:\n`;
      text += `${t(item.q, lang)}\n\n`;
      text += `${t('myResponse', lang)}:\n${responses[item.q] || t('notAnswered', lang)}\n\n`;
      text += `${t('modelAnswer', lang)}:\n${t(item.a, lang)}\n\n${subDivider}\n\n`;
    });

    setCompiled(text);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiled);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = compiled;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // ─── Landing Page ──────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-coyote-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center border border-brand-100">
          <img src="/logo.png" alt="Logo" className="w-28 h-28 mx-auto mb-4 rounded-full shadow object-cover aspect-square" />
          <p className="text-sm text-brand-600 font-semibold mb-1">{t('welcome', lang)}</p>
          <h1 className="text-2xl font-bold text-brand-800 mb-1">{t('appTitle', lang)}</h1>
          <p className="text-sm text-gray-500 mb-6">{t('appSubtitle', lang)}</p>
          <div className="flex justify-center gap-2 mb-6">
            {['en', 'es'].map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${lang === l ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-brand-50'}`}>
                {l === 'en' ? 'English' : 'Español'}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mb-3">{t('enterName', lang)}</p>
          <input
            type="text"
            placeholder={t('namePlaceholder', lang)}
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none"
            onKeyDown={e => e.key === 'Enter' && studentName.trim() && setStarted(true)}
          />
          <button
            disabled={!studentName.trim()}
            onClick={() => setStarted(true)}
            className="w-full bg-brand-600 text-white rounded-lg py-2.5 font-semibold hover:bg-brand-700 transition disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {t('startButton', lang)} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─── Main App ──────────────────────────────────────────────────
  const chunks = [
    { key: 'chunk1', icon: TreePine, ccType: 'mcq' },
    { key: 'chunk2', icon: Leaf, ccType: 'short' },
    { key: 'chunk3', icon: Thermometer, ccType: 'mcq' },
    { key: 'chunk4', icon: Beaker, ccType: 'short' },
    { key: 'chunk5', icon: Waves, ccType: 'mcq' },
    { key: 'chunk6', icon: TrendingUp, ccType: 'short' },
  ];

  const challengeItems = [
    { q: 'challengeQ1', a: 'challengeA1', marks: 4, diff: 'Medium' },
    { q: 'challengeQ2', a: 'challengeA2', marks: 4, diff: 'Medium' },
    { q: 'challengeQ3', a: 'challengeA3', marks: 3, diff: 'Medium' },
    { q: 'challengeQ4', a: 'challengeA4', marks: 4, diff: 'Medium' },
    { q: 'challengeQ5', a: 'challengeA5', marks: 3, diff: 'Easy' },
    { q: 'challengeQ6', a: 'challengeA6', marks: 4, diff: 'Medium' },
    { q: 'challengeQ7', a: 'challengeA7', marks: 4, diff: 'Hard' },
    { q: 'challengeQ8', a: 'challengeA8', marks: 3, diff: 'Medium' },
    { q: 'challengeQ9', a: 'challengeA9', marks: 4, diff: 'Hard' },
    { q: 'challengeQ10', a: 'challengeA10', marks: 3, diff: 'Medium' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-full shadow-sm" />
              <div>
                <h1 className="text-lg font-bold text-brand-800 leading-tight">{t('appTitle', lang)}</h1>
                <p className="text-xs text-gray-500">{studentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {['en', 'es'].map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${lang === l ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-brand-50'}`}>
                  {l === 'en' ? 'EN' : 'ES'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {[
              { id: 'learn', label: t('learn', lang), icon: BookOpen },
              { id: 'challenge', label: t('challenge', lang), icon: Trophy },
              { id: 'compile', label: t('compileSubmit', lang), icon: ClipboardList },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`nav-tab flex items-center gap-1.5 ${activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* ─── LEARN TAB ────────────────────────────────────────── */}
        {activeTab === 'learn' && (
          <div>
            {chunks.map((chunk, idx) => {
              const Icon = chunk.icon;
              return (
                <div key={chunk.key} className="learn-chunk">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="w-6 h-6 text-brand-600" />
                    <h2 className="text-xl font-bold text-brand-800">{t(chunk.key + 'Title', lang)}</h2>
                  </div>
                  <ContentRenderer text={t(chunk.key + 'Content', lang)} />

                  {/* Interactive after chunk 3 */}
                  {chunk.key === 'chunk3' && <ToleranceRangeExplorer lang={lang} />}
                  {/* Interactive after chunk 4 */}
                  {chunk.key === 'chunk4' && <TransectSimulator lang={lang} />}
                  {/* Interactive after chunk 5 */}
                  {chunk.key === 'chunk5' && <KiteGraphBuilder lang={lang} />}
                  {/* Interactive after chunk 6 */}
                  {chunk.key === 'chunk6' && <CorrelationCalculator lang={lang} />}

                  {/* Concept check */}
                  {chunk.ccType === 'mcq' && (
                    <ConceptCheckMCQ
                      question={t(chunk.key + 'CC1Question', lang)}
                      options={translations[chunk.key + 'CC1Options'][lang]}
                      correctIndex={translations[chunk.key + 'CC1Correct'][lang]}
                      explanation={t(chunk.key + 'CC1Explanation', lang)}
                      lang={lang}
                    />
                  )}
                  {chunk.ccType === 'short' && (
                    <ConceptCheckShortAnswer
                      question={t(chunk.key + 'CC1Question', lang)}
                      answer={t(chunk.key + 'CC1Answer', lang)}
                      lang={lang}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── CHALLENGE TAB ────────────────────────────────────── */}
        {activeTab === 'challenge' && (
          <div>
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-brand-600" />
                <span className="font-bold text-brand-800">{t('challenge', lang)}</span>
              </div>
              <p className="text-sm text-gray-600">{t('challengeIntro', lang)}</p>
            </div>
            {challengeItems.map((item, i) => (
              <ChallengeQuestion
                key={item.q}
                number={i + 1}
                question={t(item.q, lang)}
                marks={item.marks}
                difficulty={item.diff}
                response={responses[item.q]}
                onChange={val => updateResponse(item.q, val)}
                modelAnswer={t(item.a, lang)}
                lang={lang}
              />
            ))}
          </div>
        )}

        {/* ─── COMPILE TAB ──────────────────────────────────────── */}
        {activeTab === 'compile' && (
          <div>
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-5 h-5 text-brand-600" />
                <span className="font-bold text-brand-800">{t('compileSubmit', lang)}</span>
              </div>
              <p className="text-sm text-gray-600">{t('compileIntro', lang)}</p>
            </div>
            <button onClick={handleCompile}
              className="w-full bg-brand-600 text-white rounded-lg py-3 font-semibold hover:bg-brand-700 transition mb-4 flex items-center justify-center gap-2">
              <ClipboardList className="w-5 h-5" /> {t('compileButton', lang)}
            </button>
            {compiled && (
              <>
                <pre className="bg-white border border-gray-200 rounded-xl p-4 text-xs whitespace-pre-wrap font-mono max-h-[500px] overflow-y-auto mb-4">{compiled}</pre>
                <button onClick={handleCopy}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${copySuccess ? 'bg-green-500 text-white' : 'bg-coyote-500 text-white hover:bg-coyote-600'}`}>
                  {copySuccess ? <><CheckCircle2 className="w-5 h-5" /> {t('copied', lang)}</> : <><Copy className="w-5 h-5" /> {t('copyButton', lang)}</>}
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-800 text-brand-100 py-4 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs">
          <p>{t('footerTheme', lang)}</p>
          <p className="text-brand-300 mt-1">{t('footerBiozone', lang)}</p>
        </div>
      </footer>
    </div>
  );
}
