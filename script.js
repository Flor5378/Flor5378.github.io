const avatarContainer = document.querySelector('.avatar-container');
const nodes = document.querySelectorAll('.node');
const svg = document.querySelector('.connection-lines');

function positionNodes() {
  const avatarRect = avatarContainer.getBoundingClientRect();
  const centerY = avatarRect.height / 2;

  nodes.forEach((node, index) => {
    const direction = index % 2 === 0 ? -1 : 1; // Alternating left/right
    const offsetX = 120 + (Math.floor(index / 2) * 100); // Spread further out for each pair

    node.style.top = `${centerY}px`;
    node.style.left = `${avatarRect.width / 2}px`;
    node.style.transform = `translate(${direction * offsetX}px, -50%) scale(0)`;
  });
}

avatarContainer.addEventListener('mouseenter', () => {
  positionNodes(); // Position nodes
  setTimeout(() => {
    nodes.forEach(node => {
      node.style.transform += ' scale(1)';
      node.style.opacity = '1';
    });
    updateLines();
  }, 400);
});


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
  setTimeout(updateLines, 400);
});

window.addEventListener('resize', updateLines);
window.addEventListener('scroll', updateLines);

