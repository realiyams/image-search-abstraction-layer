document.addEventListener('DOMContentLoaded', () => {
  const searchTypeSelect = document.getElementById('searchType');
  const queryInput = document.getElementById('queryInput');
  const pageInput = document.getElementById('pageInput');
  const link = document.getElementById('generateLink');

  searchTypeSelect.addEventListener('change', () => {
    const selectedValue = searchTypeSelect.value;

    if (selectedValue === 'recentSearches') {
      queryInput.disabled = true;
      pageInput.disabled = true;
      queryInput.value = '';  
      pageInput.value = ''; 
      link.href = '/recent/';
    } else {
      queryInput.disabled = false;
      pageInput.disabled = false;
      link.href = '';
    }
  });

  queryInput.addEventListener('change', () => {
    const queryValue = queryInput.value;

    if (queryValue !== '') {
      link.href = `/query/${queryValue}`;
    } else {
      link.href = '';
    }
  })

  pageInput.addEventListener('change', () => {
    const pageValue = pageInput.value;

    if (queryInput.value !== '') {
      if (pageValue > 1) {
        link.href = `/query/${queryInput.value}?page=${pageValue}`;
      } 
      
      if (pageValue < 1 || pageValue === '') {
        link.href = `/query/${queryInput.value}`;
      }
    } 
  })

});
