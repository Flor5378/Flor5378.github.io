const avatarContainer = document.querySelector('.avatar-container');
const nodes = document.querySelectorAll('.node');
const svg = document.querySelector('.connection-lines');

function positionNodes() {
  const avatarRect = avatarContainer.getBoundingClientRect();
  const centerY = avatarRect.height / 2;

  const baseSpacing = 200; // distance horizontale
  const nodeGap = 150;     // écart horizontal entre nodes
  const verticalGap = 60;  // espace vertical entre les nodes

  nodes.forEach((node, index) => {
    const isLeft = index % 2 === 0;
    const level = Math.floor(index / 2);

    const offsetX = baseSpacing + (level * nodeGap);
    const offsetY = centerY + (level * verticalGap * (isLeft ? -1 : 1)); 
    // on décale verticalement : nodes gauche vers le haut, droite vers le bas

    node.style.left = `${avatarRect.width / 2}px`;
    node.style.top = `${offsetY}px`;

    const translateX = isLeft ? -offsetX : offsetX;
    node.style.transform = `translate(${translateX}px, -50%) scale(0)`;
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

    // Wait for CSS transition before updating lines
    setTimeout(updateLines, 600);  // Wait for transform transition (0.6s)
  }, 400);
});


window.addEventListener('resize', updateLines);
window.addEventListener('scroll', updateLines);




