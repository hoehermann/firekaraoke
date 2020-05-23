var RandomName = {
  random_name: length => {
    let vovels = 'aeiou';
    let consonants = 'wrtzpsdfgklbnm';
    let name = '';
    let vovel_needed = false;
    while (name.length < length) {
      if (vovel_needed) {
        name += vovels[Math.floor(Math.random() * vovels.length)];
      } else {
        name += consonants[Math.floor(Math.random() * consonants.length)];
      }
      if (name.length == 1) {
        name = name.toUpperCase();
      }
      vovel_needed = !vovel_needed;
    }
    return name;
  },
  random_id: length => {
    // https://stackoverflow.com/questions/1349404/
    // not really random, but okay for me right now
    return Math.random().toString(36).substr(2, length);
  }
};