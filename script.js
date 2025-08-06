function positionNodes() {
  const avatarRect = avatarContainer.getBoundingClientRect();
  const centerY = avatarRect.height / 2;

  const baseSpacingLeft = 250;   // plus éloigné à gauche (plus d'espace horizontal)
  const baseSpacingRight = 150;  // moins éloigné à droite

  const nodeGap = 150;  // écart horizontal entre nodes à chaque niveau

  const verticalGapLeft = 60;   // espace vertical gauche (serré)
  const verticalGapRight = 100; // espace vertical droite (plus grand)

  nodes.forEach((node, index) => {
    const isLeft = index % 2 === 0;
    const level = Math.floor(index / 2);

    // Distance horizontale selon le côté
    const baseSpacing = isLeft ? baseSpacingLeft : baseSpacingRight;
    const offsetX = baseSpacing + (level * nodeGap);

    // Distance verticale selon le côté
    const verticalGap = isLeft ? verticalGapLeft : verticalGapRight;
    const offsetY = centerY + (level * verticalGap * (isLeft ? -1 : 1));

    node.style.left = `${avatarRect.width / 2}px`;
    node.style.top = `${offsetY}px`;

    const translateX = isLeft ? -offsetX : offsetX;
    node.style.transform = `translate(${translateX}px, -50%) scale(0)`;
    node.style.opacity = '0';
  });
}
