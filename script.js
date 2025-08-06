<script>
  const avatarContainer = document.querySelector('.avatar-container');
  const nodes = document.querySelectorAll('.node');
  const svg = document.querySelector('.connection-lines');

  function updateLines() {
    svg.innerHTML = ''; // Clear previous lines
    const avatarRect = avatarContainer.getBoundingClientRect();
    const avatarCenter = {
      x: avatarRect.left + avatarRect.width / 2,
      y: avatarRect.top + avatarRect.height / 2
    };

    nodes.forEach(node => {
      const nodeRect = node.getBoundingClientRect();
      const nodeCenter = {
        x: nodeRect.left + nodeRect.width / 2,
        y: nodeRect.top + nodeRect.height / 2
      };

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute('x1', avatarCenter.x);
      line.setAttribute('y1', avatarCenter.y);
      line.setAttribute('x2', nodeCenter.x);
      line.setAttribute('y2', nodeCenter.y);
      line.setAttribute('stroke', '#004080');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-dasharray', '4 4');
      line.style.transition = 'stroke-dashoffset 0.6s ease';
      svg.appendChild(line);
    });
  }

  avatarContainer.addEventListener('mouseenter', () => {
    setTimeout(updateLines, 400); // Delay for smooth appearance
  });

.connection-lines line {
  stroke-dashoffset: 100;
}

.avatar-container:hover ~ .connection-lines line {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.8s ease;
}

  window.addEventListener('resize', updateLines); // Adjust on resize
</script>
