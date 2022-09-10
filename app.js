/*
  - Construa uma aplicação de conversão de moedas. O HTML e CSS são os que você
    está vendo no browser;
  - Você poderá modificar a marcação e estilos da aplicação depois. No momento, 
    concentre-se em executar o que descreverei abaixo;
    - Quando a página for carregada: 
      - Popule os <select> com tags <option> que contém as moedas que podem ser
        convertidas. "BRL" para real brasileiro, "EUR" para euro, "USD" para 
        dollar dos Estados Unidos, etc.
      - O option selecionado por padrão no 1º <select> deve ser "USD" e o option
        no 2º <select> deve ser "BRL";
      - O parágrafo com data-js="converted-value" deve exibir o resultado da 
        conversão de 1 USD para 1 BRL;
      - Quando um novo número for inserido no input com 
        data-js="currency-one-times", o parágrafo do item acima deve atualizar 
        seu valor;
      - O parágrafo com data-js="conversion-precision" deve conter a conversão 
        apenas x1. Exemplo: 1 USD = 5.0615 BRL;
      - O conteúdo do parágrafo do item acima deve ser atualizado à cada 
        mudança nos selects;
      - O conteúdo do parágrafo data-js="converted-value" deve ser atualizado à
        cada mudança nos selects e/ou no input com data-js="currency-one-times";
      - Para que o valor contido no parágrafo do item acima não tenha mais de 
        dois dígitos após o ponto, você pode usar o método toFixed: 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    - Para obter as moedas com os valores já convertidos, use a Exchange rate 
      API: https://www.exchangerate-api.com/;
      - Para obter a key e fazer requests, você terá que fazer login e escolher
        o plano free. Seus dados de cartão de crédito não serão solicitados.
*/

const currencyOneContainer = document.querySelector('[data-js="currency-one"]')
const currencyTwoContainer = document.querySelector('[data-js="currency-two"]')
const currencyOneTimesContainer = document.querySelector('[data-js="currency-one-times"]')
const convertedValueContainer = document.querySelector('[data-js="converted-value"]')
const conversionPrecisionContainer = document.querySelector('[data-js="conversion-precision"]')

let internalConversionRates = {}

const fetchCurrencyData = async (currency) => {
  const response = await fetch(`https://v6.exchangerate-api.com/v6/675a3f5f5f80c0d9f1908dbb/latest/${currency}`)
  return response.json()
}

const calculateConvertedValue = (currencyOne, currencyTwo) => {
  const result = internalConversionRates[currencyOne.value] * internalConversionRates[currencyTwo.value]
  const formattedResult = result.toFixed(2)

  return formattedResult
}

const showConvertedValue = () => {
  const result = calculateConvertedValue(currencyOneContainer, currencyTwoContainer)
  convertedValueContainer.textContent = result
}

const showConversionPrecision = (currencyOne, currencyTwo) => {
  const currencyOneName = currencyOne.selectedOptions[0].textContent
  const currencyTwoName = currencyTwo.selectedOptions[0].textContent

  const conversionPrecisionText = `1 ${currencyOneName} = ${internalConversionRates[currencyTwo.value]} ${currencyTwoName}`
  conversionPrecisionContainer.textContent = conversionPrecisionText
}
 
const init = async () => {
  const { conversion_rates } = await fetchCurrencyData('USD')
  internalConversionRates = { ...conversion_rates }

  Object.keys(internalConversionRates).forEach((currency) => {
    currencyOneContainer.innerHTML += currency === 'USD'
      ? `<option selected>${currency}</option>`
      : `<option>${currency}</option>`

    currencyTwoContainer.innerHTML += currency === 'BRL'
      ? `<option selected>${currency}</option>`
      : `<option>${currency}</option>`
  })

  showConvertedValue(currencyOneContainer, currencyTwoContainer)
  showConversionPrecision(currencyOneContainer, currencyTwoContainer)
}

init()

currencyOneContainer.addEventListener('input', async () => {
  const selectedCurrency = currencyOneContainer.value
  const { conversion_rates } = await fetchCurrencyData(selectedCurrency)
  internalConversionRates = { ...conversion_rates }

  showConvertedValue(currencyOneContainer, currencyTwoContainer)
  showConversionPrecision(currencyOneContainer, currencyTwoContainer)
})

currencyTwoContainer.addEventListener('input', () => {
  showConvertedValue(currencyOneContainer, currencyTwoContainer)
  showConversionPrecision(currencyOneContainer, currencyTwoContainer)
})

currencyOneTimesContainer.addEventListener('input', () => {
  const convertedValue = calculateConvertedValue(currencyOneContainer, currencyTwoContainer)
  const finalResult = convertedValue * currencyOneTimesContainer.value

  convertedValueContainer.textContent = finalResult.toFixed(2)
})