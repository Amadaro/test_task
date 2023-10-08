<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  let fromCurrency = '';
  let toCurrency = '';
  let amountFrom: number = 0;
  let amountTo: number = 0;

  let exchangeRates: { [key: string]: number } = {};

  async function fetchExchangeRates() {
    try {
      const response = await fetch('https://v6.exchangerate-api.com/v6/b562818db1b33b0a303852d8/latest/USD');
      if (response.ok) exchangeRates = (await response.json()).conversion_rates || {};
    } catch (error) {
      console.error('Ошибка при получении курсов валют:', error);
    }
  }

  onMount(fetchExchangeRates);

  function calculateAmountTo() {
    if (fromCurrency && toCurrency && exchangeRates[fromCurrency] && exchangeRates[toCurrency])
      amountTo = +(+amountFrom * exchangeRates[toCurrency]).toFixed(2);
  }

  function calculateAmountFrom() {
    if (fromCurrency && toCurrency && exchangeRates[fromCurrency] && exchangeRates[toCurrency])
      amountFrom = +(+amountTo / exchangeRates[toCurrency]).toFixed(2);
  }

  const dispatch = createEventDispatcher();

  function handleAmountChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = parseFloat(inputElement.value);
    if (!isNaN(inputValue)) {
      if (inputElement.id === 'amountFrom') amountFrom = inputValue;
      else if (inputElement.id === 'amountTo') amountTo = inputValue;
      dispatch('conversion', { fromCurrency, toCurrency, amountFrom, amountTo });
    }
  }
</script>

<main>
  <h1>Конвертер валют</h1>

  <div class="currency-row">
    <div>
      <label for="fromCurrency">Валюта №1:</label>
      <select id="fromCurrency" bind:value={fromCurrency}>
        {#each Object.keys(exchangeRates) as currency}
          <option value={currency}>{currency}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="amountFrom">Сумма №1:</label>
      <input
        type="text"
        id="amountFrom"
        bind:value={amountFrom}
        on:input={calculateAmountTo}
        on:change={handleAmountChange}
      />
    </div>
  </div>

  <div class="currency-row">
    <div>
      <label for="toCurrency">Валюта №2:</label>
      <select id="toCurrency" bind:value={toCurrency}>
        {#each Object.keys(exchangeRates) as currency}
          <option value={currency}>{currency}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="amountTo">Сумма №2:</label>
      <input
        type="text"
        id="amountTo"
        bind:value={amountTo}
        on:input={calculateAmountFrom}
        on:change={handleAmountChange}
      />
    </div>
  </div>
</main>
<style>
  main {
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 10px 25px 10px 25px;

    box-shadow: 0px 0px 10px rgba(254, 254, 254, 0.5);
  }

  h1 {
    font-size: 30px;
  }

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
  }

  label {
    width: 100px;
  }

  input[type="text"],
  select {
    margin-right: 10px;
    width: 60px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  input[type="text"] {
    width: 150px;
  }
</style>
