const axios = require('axios');
const { JSDOM } = require('jsdom');

const STRAIGHT_ANGLES = [0, 90, 180, 270];
const URL = 'https://devrel.wearedevelopers.com/code100-puzzles/041-hearts-and-minds/hearts-and-minds.html';

// Heart can be one of the following symbols
const heart = ['♥', '❤️'];
const mind = '🧠';

function getAngle(angle) {
  // Normalize to 0–359
  angle = ((angle % 360) + 360) % 360;
  return Math.round(angle);
}

function isStraight(angle) {
  return STRAIGHT_ANGLES.includes(angle);
}

async function solvePuzzle() {

  try {
    const res = await axios.get(URL);
    const dom = new JSDOM(res.data);
    const document = dom.window.document;

    const canvas = document.querySelector('#canvas');
    const emojiDivs = canvas.querySelectorAll('div');

    let straightHearts = 0;
    let straightMinds = 0;
    let heartsOnRight = 0;
    let mindsOnLeft = 0;
    let straightRedHearts = 0;
    let redHeartsOnRight = 0;

    emojiDivs.forEach((emojiDiv) => {
        const type = emojiDiv.textContent.trim();
        const classList = emojiDiv.className.split(" ");
        const rotClass = classList.find(cls => cls.startsWith("rot-"));
        if (rotClass) {
            const rotationAngle = parseInt(rotClass.replace("rot-", ""), 10);
            let angle = getAngle(rotationAngle);

            // Count straight
            if (angle !== null && isStraight(angle)) {
                if (heart.includes(type)) {
                  straightHearts++;

                  // Count straight red hearts - if needed
                  const colorClass = classList.find(cls => cls.startsWith("color-"));
                  const color = colorClass.replace("color-", "");
                  if (color === 'ff0000') {
                    straightRedHearts++;
                  }
                }
                else if (type === mind) straightMinds++;
            }
        }

        const leftClass = classList.find(cls => cls.startsWith("left-"));
        if (leftClass) {
            const left = parseInt(leftClass.replace("left-", ""), 10);

            // Minds on the left side of the bunch
            if (type === mind && left !== null && left < 50) {
                mindsOnLeft++;
            }

            // Minds on the left side of the bunch
            if (heart.includes(type) && left !== null && left > 50) {
                heartsOnRight++;
              // Count red hearts on right - if needed
              const colorClass = classList.find(cls => cls.startsWith("color-"));
              const color = colorClass.replace("color-", "");
              if (color === 'ff0000') {
                redHeartsOnRight++;
              }
            }
        }
        
    })

    console.log(`Straight hearts ❤️: ${straightHearts}`);
    console.log(`Straight minds 🧠: ${straightMinds}`);
    console.log(`Minds 🧠 on left side: ${mindsOnLeft}`);
    console.log(`Hearts ❤️ on right side: ${heartsOnRight}`);
    console.log(`Straight red hearts ❤️: ${straightRedHearts}`);
    console.log(`Red hearts on right ❤️: ${redHeartsOnRight}`);

  } catch (err) {
    console.error('Error fetching or parsing the page:', err.message);
  }
}

solvePuzzle();
