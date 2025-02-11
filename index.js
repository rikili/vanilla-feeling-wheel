// hello!..

function toPxStr(dim) {
    return dim.toString() + "px";
}

// constants
const BORDER_THICKNESS = 2;
const CIRCLE_LAYERS = 3;
const SPLIT = {
    Happy: {
        Playful: ['Aroused', 'Cheeky'],
        Content: ['Free', 'Joyful'],
        Interested: ['Curious', 'Inquisitive'],
        Proud: ['Successful', 'Confident'],
        Accepted: ['Respected', 'Valued'],
        Powerful: ['Courageous', 'Creative'],
        Peaceful: ['Loving', 'Thankful'],
        Trusting: ['Sensitive', 'Intimate'],
        Optimistic: ['Hopeful', 'Inspired']
    },
    Sad: {
        Hurt: ['Embarassed', 'Disappointed'],
        Depressed: ['Inferior', 'Empty'],
        Guilty: ['Remorseful', 'Ashamed'],
        Despair: ['Grief', 'Powerless'],
        Vulnerable: ['Victimized', 'Fragile'],
        Lonely: ['Isolated', 'Abandoned']
    },
    Disgusted: {
        Disapproving: ['Judgemental', 'Embarassed'],
        Disappointed: ['Appalled', 'Revolted'],
        Awful: ['Nauseated', 'Detestable'],
        Repelled: ['Horrified', 'Hesitant']
    },
    Angry: {
        "Let Down": ['Betrayed', 'Resentful'],
        Humiliated: ['Disrespected', 'Ridiculed'],
        Bitter: ['Indignant', 'Violated'],
        Mad: ['Furious', 'Jealous'],
        Aggressive: ['Provoked', 'Hostile'],
        Frustrated: ['Infuriated', 'Annoyed'],
        Distant: ['Withdrawn', 'Numb'],
        Critical: ['Skeptical', 'Dismissive']
    },
    Fearful: {
        Scared: ['Helpless', 'Frightened'],
        Anxious: ['Overwhelmed', 'Worried'],
        Insecure: ['Inadequate', 'Inferior'],
        Weak: ['Worthless', 'Insignificant'],
        Rejected: ['Excluded', 'Persecuted'],
        Threatened: ['Nervous', 'Exposed']
    },
    Bad: {
        Bored: ['Indifferent', 'Apathetic'],
        Busy: ['Pressured', 'Rushed'],
        Stressed: ['Overwhelmed', 'Out of Control'],
        Tired: ['Sleepy', 'Unfocused']
    },
    Surprised: {
        Startled: ['Shocked', 'Dismayed'],
        Confused: ['Disillusioned', 'Perplexed'],
        Amazed: ['Astonished', 'Awe'],
        Excited: ['Eager', 'Energetic']
    }
};
const SPLIT_COLORS = [
    ['#E88501', '#DD6200'], // split by light and dark
    ['#322B54', '#260744'],
    ['#B25C30', '#7C3C07'],
    ['#CE2C3C', '#921929'],
    ['#D2278A', '#A91F70'],
    ['#512E7A', '#432262'],
    ['#4A745F', '#1C5036']
];

const OPP_DEGREE_90 = 265;
const DEGREE_90 = 450;

function countLayers(object) {
    let layerCount = Array(CIRCLE_LAYERS).fill(0); // count values in each layer
    let categoryCount = []; // count values of each layer split by category
    let layerLabels = Array(CIRCLE_LAYERS).fill([]);
    let categoryTrack = -1;

    function countItems(currentObject, layer = 0) {
        if (!Array.isArray(currentObject))
        {
            if (layer === 1)
            {
                categoryTrack += 1;
                categoryCount.push([1]);
            }
            if (layer > 0)
            {
                categoryCount[categoryTrack][layer] = Object.keys(currentObject).length;
            }
            layerCount[layer] += Object.keys(currentObject).length;
            Object.values(currentObject).forEach((item) => countItems(item, layer + 1));
            layerLabels[layer] = layerLabels[layer].concat(Object.keys(currentObject));
        }
        else
        {
            layerCount[layer] += currentObject.length;
            categoryCount[categoryTrack][layer] = (categoryCount[categoryTrack][layer] || 0) + currentObject.length;
            layerLabels[layer] = layerLabels[layer].concat(Object.values(currentObject));
        }
    }
    countItems(object);

    return {
        layerSplit: layerCount,
        categorySplit: categoryCount,
        layerLabels
    };
}

function makeDeg(degNum) { return degNum.toString() + "deg" };

const base = document.getElementById("base");
let baseAngle = 0;
document.addEventListener('DOMContentLoaded', () => {
    const circle = document.getElementsByClassName("circle")[0];
    const minDim = window.innerWidth < window.innerHeight ? innerWidth : innerHeight;

    // define circle dimensions

    let circleDims = [];
    let circleOffsets = [];

    const circleElements = [] // each item will be [container elem, circle elem, array of divider elems]

    let lastRadius = minDim;
    const layerInfo = countLayers(SPLIT);
    const layerCounts = Object.values(layerInfo.layerSplit).reverse();

    for (let x = 0; x < CIRCLE_LAYERS; x++)
    {

        // BUILD DIMENSIONS
        const thisDim = (minDim / CIRCLE_LAYERS) * (CIRCLE_LAYERS - x); // Circle diameter based on no. layers & screen dimensions
        circleDims.unshift([
            thisDim, // height
            thisDim // width
        ]);
        circleOffsets.unshift([
            window.innerWidth / 2 - thisDim / 2, // left
            window.innerHeight / 2 - thisDim / 2 // top
        ])
        lastRadius = thisDim;

        // BUILD ELEMENTS
        const circleContainer = document.createElement("div");
        const circleSeparator = document.createElement("div");
        const circle = document.createElement("div");

        circle.className = "circle";
        circleContainer.className="circleContainer";
        circleSeparator.className="circleSeparator";

        circleContainer.appendChild(circleSeparator);
        circleContainer.appendChild(circle);
        base.appendChild(circleContainer);


        let dividers = [];
        let texts = [];
        for (let y = 0; y < layerCounts[x]; y++)
        {
            const divider = document.createElement("div");
            const textContainer = document.createElement("div");
            const textSpan = document.createElement("span");
            let node;
            if (x === CIRCLE_LAYERS - 1)
            {
                node = document.createTextNode(layerInfo.layerLabels[CIRCLE_LAYERS - x - 1][y]);
            }
            else
            {
                node = document.createTextNode(layerInfo.layerLabels[CIRCLE_LAYERS - x - 1][y]);
            }

            textSpan.appendChild(node);
            textContainer.appendChild(textSpan);
            circle.appendChild(divider);
            circle.appendChild(textContainer);

            divider.className = "divider";
            textContainer.className = "textContainer";
            textSpan.className = "textSpan";

            dividers.push(divider);
            texts.push(textContainer);
        }

        circleElements.push([circleContainer, circle, circleSeparator, dividers, texts]);
    }

    const totalLeaves = layerInfo.categorySplit.reduce((acc, val) => acc + val[CIRCLE_LAYERS - 1], 0);

    let lastRot = 90; // tracker only for innermost circle
    circleElements.forEach(([container, circle, circleSeparator, dividers, texts], idx) => { //iterating from largest circle to smallest
        idx = CIRCLE_LAYERS - idx - 1;
        // if (idx !== 2) return;

        const heightStr = toPxStr(circleDims[idx][0]);
        const circleHeightStr = toPxStr(circleDims[idx][0] - 5);
        container.style.maxHeight = heightStr;
        container.style.minHeight = heightStr;
        circle.style.maxHeight = circleHeightStr;
        circle.style.minHeight = circleHeightStr;
        circleSeparator.style.maxHeight = heightStr;
        circleSeparator.style.minHeight = heightStr;


        const widthStr = toPxStr(circleDims[idx][1]);
        const circleWidthStr = toPxStr(circleDims[idx][1] - 5);
        container.style.minWidth = widthStr;
        container.style.maxWidth = widthStr;
        circle.style.minWidth = circleWidthStr;
        circle.style.maxWidth = circleWidthStr;
        circleSeparator.style.minWidth = widthStr;
        circleSeparator.style.maxWidth = widthStr;

        container.style.left = toPxStr(circleOffsets[idx][0]);
        circle.style.left = toPxStr(2.5);
        container.style.top = toPxStr(circleOffsets[idx][1]);
        circle.style.top = toPxStr(2.5);

        const singleRot = 360 / dividers.length;
        let gradientStr = "";
        let degTrack = 0;

        let gradientCount = 0;
        let gradientIndex = 0;

        dividers.forEach((divider, divInd) => {
            
            // SETUP DIVIDERS
            divider.style.top = toPxStr(circleDims[idx][0] / 2 - BORDER_THICKNESS / 2 - 2.5);
            divider.style.left = toPxStr(-2.5);
            divider.style.height = toPxStr(BORDER_THICKNESS);
            divider.style.width = toPxStr(circleDims[idx][1] / 2);
            divider.style.transformOrigin = "center right";

            texts[divInd].style.top = toPxStr(circleDims[idx][0] / 2 - BORDER_THICKNESS / 2 - 2.5);
            texts[divInd].style.left = toPxStr(-2.5);
            texts[divInd].style.height = toPxStr(BORDER_THICKNESS);
            texts[divInd].style.width = toPxStr(circleDims[idx][1] / 2);
            texts[divInd].style.transformOrigin = "center right";

            let thisRot = 360 * 1 / layerInfo.layerSplit[idx];
            if (idx === 0)
            {
                thisRot = 360 * (layerInfo.categorySplit[divInd][CIRCLE_LAYERS - 1] / totalLeaves);
                divider.style.rotate = `${lastRot + thisRot}deg`;
                texts[divInd].style.rotate = `${lastRot + (thisRot / 2)}deg`;
                lastRot += thisRot;

                if (lastRot < OPP_DEGREE_90) {
                    Array.from(texts[divInd].children)[0].style.rotate = makeDeg(180);
                }
            }
            else
            {
                const rot = 90 + singleRot * divInd;
                divider.style.rotate = `${rot}deg`;
                texts[divInd].style.rotate = `${rot + 2}deg`;

                if (rot < OPP_DEGREE_90 || rot > DEGREE_90) {
                    Array.from(texts[divInd].children)[0].style.rotate = makeDeg(180);
                }
            }

            // BUILD GRADIENT
            if (idx === 0)
            {
                thisRot = 360 * layerInfo.categorySplit[divInd][CIRCLE_LAYERS - 1] / totalLeaves;
                gradientStr += `${SPLIT_COLORS[divInd][0]} ${makeDeg(degTrack)} ${makeDeg(degTrack + thisRot)},`;
            }
            else if (gradientIndex < SPLIT_COLORS.length)
            {
                const colorChoice = idx % 2;

                gradientStr += `${SPLIT_COLORS[gradientIndex][colorChoice]} ${makeDeg(degTrack)} ${makeDeg(degTrack + thisRot)},`;
                gradientCount++;
                if (gradientCount > layerInfo.categorySplit[gradientIndex][idx] - 1)
                {
                    gradientCount = 0;
                    gradientIndex += 1;
                }
            }
            degTrack += (thisRot);
        });

        gradientStr = gradientStr.slice(0, gradientStr.length - 1);
        circle.style.background = `conic-gradient(${gradientStr})`;
    });
});

let isMouseDown = false;
let mdAngle;
let angleControl = 0;

function getAngle(element, event) {
    const bounding = element.getBoundingClientRect();
    const centerX = bounding.left + bounding.width / 2;
    const centerY = bounding.top + bounding.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }

document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    base.style.cursor = "grabbing";
    mdAngle = getAngle(base, e);
});

document.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;

    const startAngle = getAngle(base, e);
    const changeAngle = startAngle - mdAngle;
    angleControl += changeAngle;
    mdAngle = startAngle;
    angleControl = angleControl % 360;

    base.style.rotate = `${angleControl}deg`;
});

function getDegree(degStr) {
    return Number(degStr.slice(0, degStr.length - 3));
}

document.addEventListener('mouseup', () => {
    isMouseDown = false;
    base.style.cursor = 'grab';

    // RECALCULATE
    const textContainers = Array.from(document.getElementsByClassName('textContainer'));
    textContainers.forEach((container) => {
        const currDeg = getDegree(container.style.rotate);
        const finalRot = (angleControl + currDeg) % 360;

        if (finalRot > 90 && finalRot < 270)
        {
            Array.from(container.children)[0].style.rotate = makeDeg(180);
        }
        else
        {
            Array.from(container.children)[0].style.rotate = makeDeg(0);
        }
    });
});

  