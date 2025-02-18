export const buildTattooPrompt = (answers: any) => {
  return `Create one unique, standalone tattoo design based on the following specifications:

**Themes:** ${answers.theme.join(', ')}
**Styles:** ${answers.style.join(', ')}
**Size:** ${answers.size}
**Elements** ${answers.elements.join(', ')}
**Inspiration Story:** ${answers.inspiration || 'No specific story provided'}
${answers.referenceImages?.length ? `**Reference Images:** ${answers.referenceImages.length} image(s) provided for inspiration` : ''}

Design Guidelines:
1. Focus exclusively on the tattoo design without including any human bodies or skin.
2. Present the tattoo design on a plain, flat background (like a digital canvas or stencil).
3. Seamlessly combine elements from the specified themes and styles.
4. Incorporate the provided inspiration story in a subtle and artistic manner.
5. Ensure the design adheres to the size constraints for clarity and detail.
6. Deliver a high-quality, digital tattoo design that can be directly used as a tattoo stencil or reference.

Output one complete tattoo design without extraneous elements.`;
};