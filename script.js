const avatarContainer = document.querySelector('.avatar-container');
const nodes = document.querySelectorAll('.node');
const svg = document.querySelector('.connection-lines');
function positionNodes() {
  const avatarRect = avatarContainer.getBoundingClientRect();
  const centerY = avatarRect.height / 2;

  const baseSpacing = 200; // augmente la distance initiale
  const nodeGap = 150;     // augmente l’écart entre nodes

  nodes.forEach((node, index) => {
    const isLeft = index % 2 === 0;
    const level = Math.floor(index / 2);
    const offsetX = baseSpacing + (level * nodeGap);

    node.style.top = `${centerY}px`;
    node.style.left = `${avatarRect.width / 2}px`;

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



