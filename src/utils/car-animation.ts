const animationIds = new Map<HTMLElement, number>();

export function animateCar(
  element: HTMLElement,
  distance: number,
  duration: number,
  onFinish?: () => void,
): void {
  const startTime = performance.now();

  const animate = (currentTime: number): void => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const position = distance * progress;

    element.style.transform = `translateX(${position}px)`;

    if (progress < 1) {
      const animationId = requestAnimationFrame(animate);

      animationIds.set(element, animationId);
    } else {
      animationIds.delete(element);
      onFinish?.();
    }
  };

  const animationId = requestAnimationFrame(animate);

  animationIds.set(element, animationId);
}

export function stopAnimation(element: HTMLElement): void {
  const animationId = animationIds.get(element);

  if (animationId !== undefined) {
    cancelAnimationFrame(animationId);
    animationIds.delete(element);
  }
}
