(function() {
  "use strict";

  const filtersContainer = document.querySelector('.portfolio-filters');
  const galleryContainer = document.querySelector('.isotope-container');

  if (!filtersContainer || !galleryContainer) return;

  function createFilter(filter, label) {
    const item = document.createElement('li');
    item.dataset.filter = filter === '*' ? '*' : `.filter-${filter}`;
    item.textContent = label;
    if (filter === '*') item.classList.add('filter-active');
    return item;
  }

  function createGalleryItem(item) {
    const galleryItem = document.createElement('div');
    galleryItem.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${item.filter}`;

    const image = document.createElement('img');
    image.src = item.image;
    image.className = 'img-fluid';
    image.alt = item.description;

    const info = document.createElement('div');
    info.className = 'portfolio-info';
    info.innerHTML = `<h4>${item.heading}</h4><p>${item.description}</p>`;

    const preview = document.createElement('a');
    preview.href = item.image;
    preview.title = item.title || `${item.heading} - ${item.description}`;
    preview.dataset.gallery = 'portfolio-gallery';
    preview.className = 'glightbox preview-link';
    preview.innerHTML = '<i class="bi bi-zoom-in"></i>';

    info.appendChild(preview);
    galleryItem.append(image, info);
    return galleryItem;
  }

  fetch('../data/gallery.json')
    .then(response => {
      if (!response.ok) throw new Error(`Unable to load gallery data: ${response.status}`);
      return response.json();
    })
    .then(items => {
      const filters = [...new Set(items.map(item => item.filter))];

      filtersContainer.replaceChildren(createFilter('*', 'Tutte'));
      filters.forEach(filter => {
        filtersContainer.appendChild(createFilter(filter, filter === 'prima' ? '..' : filter));
      });

      galleryContainer.replaceChildren(...items.map(createGalleryItem));
      window.dispatchEvent(new Event('gallery:loaded'));
    })
    .catch(error => {
      console.error('Gallery could not be loaded.', error);
    });
})();
