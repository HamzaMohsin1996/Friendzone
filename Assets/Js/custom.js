document.addEventListener('DOMContentLoaded', function() {
  const tables = document.querySelectorAll('.table');
  const chairs = document.querySelectorAll('.chair');

  tables.forEach(table => {
    table.addEventListener('click', () => {
      table.classList.toggle('moved'); // Toggle the 'moved' class to animate movement
    });
  });

  chairs.forEach(chair => {
    chair.addEventListener('click', () => {
      chair.classList.toggle('moved'); // Toggle the 'moved' class to animate movement
    });
  });
});
