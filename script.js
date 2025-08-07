const avatarContainer = document.querySelector('.avatar-container');
const nodes = document.querySelectorAll('.node');
const svg = document.querySelector('.connection-lines');

function positionNodes() {
  const avatarRect = avatarContainer.getBoundingClientRect();
  const centerY = avatarRect.height / 2;

  const baseSpacing = 180; // distance minimale horizontale entre avatar et nodes
  const nodeGap = 150; // écart horizontal entre les nodes successifs

  let leftIndex = 0;
  let rightIndex = 0;

  nodes.forEach((node, index) => {
    const isLeft = index % 2 === 0;

    const level = isLeft ? leftIndex++ : rightIndex++;
    const offsetX = baseSpacing + (level * nodeGap);

    node.style.top = `${centerY}px`; // Aligne tous les nodes à la même hauteur (verticalement centré)

    if (isLeft) {
      node.style.left = `calc(50% - ${offsetX}px)`;
      node.style.transform = `translateX(-100%) translateY(-50%) scale(0)`;
    } else {
      node.style.left = `calc(50% + ${offsetX}px)`;
      node.style.transform = `translateX(0%) translateY(-50%) scale(0)`;
    }

    node.style.opacity = '0';
  });
}

function updateLines() {
  svg.innerHTML = ''; // Clear previous lines
  const avatarRect = avatarContainer.getBoundingClientRect();
  const avatarCenter = {
    x: avatarRect.left + avatarRect.width / 2 + window.scrollX,
    y: avatarRect.top + avatarRect.height / 2 + window.scrollY
  };

  nodes.forEach(node => {
    const nodeRect = node.getBoundingClientRect();
    const nodeCenter = {
      x: nodeRect.left + nodeRect.width / 2 + window.scrollX,
      y: nodeRect.top + nodeRect.height / 2 + window.scrollY
    };

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', avatarCenter.x);
    line.setAttribute('y1', avatarCenter.y);
    line.setAttribute('x2', nodeCenter.x);
    line.setAttribute('y2', nodeCenter.y);
    line.setAttribute('stroke', '#004080');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '4 4');
    svg.appendChild(line);
  });
}

avatarContainer.addEventListener('mouseenter', () => {
  positionNodes();

  setTimeout(() => {
    nodes.forEach(node => {
      node.style.transform = node.style.transform.replace('scale(0)', 'scale(1)');
      node.style.opacity = '1';
    });

    setTimeout(updateLines, 600);
  }, 400);
});

window.addEventListener('resize', updateLines);
window.addEventListener('scroll', updateLines);

document.addEventListener('DOMContentLoaded', () => {
  positionNodes();  // Position initiale des nodes (cachée en scale(0))
});



