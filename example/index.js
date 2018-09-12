import print from 'printing'

const form = document.getElementById('form')
const table = document.getElementById('table')
const btnForm = document.getElementById('btnForm')
const btnTable = document.getElementById('btnTable')
const btnAll = document.getElementById('btnAll')

btnForm.addEventListener('click', () => {
  print(form).then(() => {
    console.log('success')
  })
})

btnTable.addEventListener('click', () => {
  print(table).then(() => {
    console.log('success')
  })
})

btnAll.addEventListener('click', () => {
  print([form, table], {direction: 'horizontal'}).then(() => {
    console.log('success')
  })
})
