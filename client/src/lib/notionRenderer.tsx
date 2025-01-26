const renderRichText = (richText: any[]) => {
  return richText.map((textPart, index) => {
    let content = textPart.text.content;
    if (textPart.text.link) {
      return `<a href="${textPart.text.link.url}" class="underline hover:text-primary">${content}</a>`;
    }
    return content;
  }).join('');
};

export const renderNotionBlocks = (blocks: any[]) => {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p class="mb-4">${renderRichText(block.paragraph.rich_text)}</p>`;

      case 'heading_3':
        return `<h3 class="text-lg font-bold mt-6 mb-3">${renderRichText(block.heading_3.rich_text)}</h3>`;

      case 'image':
        const src = block.image.type === 'file' ? block.image.file.url : block.image.external.url;
        return `<div class="my-6">
                  <img src="${src}" alt="" class="mx-auto rounded-lg shadow-md" />
                </div>`;

      case 'bulleted_list_item':
        return `<li class="ml-4 list-disc">${renderRichText(block.bulleted_list_item.rich_text)}</li>`;

      default:
        console.warn('Unhandled block type:', block.type);
        return '';
    }
  }).join('');
};