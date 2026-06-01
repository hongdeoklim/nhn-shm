import Vue from 'vue'

Vue.filter('title', function (value, replacer = '_') {
  if (!value) return ''
  value = value.toString()

  const arr = value.split(replacer)
  const capitalized_array = []
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
    capitalized_array.push(capitalized)
  })
  return capitalized_array.join(' ')
})

Vue.filter('comma', function (value) {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return 0
})

Vue.filter('comNumber', function(value) {
  try {
    const regex = /[^0-9]/g;
    const result = value.replace(regex, "");
    return result.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
  } catch (err) {}
  return value
})

