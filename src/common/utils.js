const prettifyAddress = (address) => {
	return `${address.substring(0, 7)}...${address.substring(address.length - 4, address.length)}`
}

const prettifyCurrency = (amount, minFractionDigits = 0, maxFractionDigits = 2, currency = 'USD', locales = 'en-US') => {
	let symbol = ''
	let symbolPrepended = false
	let cryptocurrency = false
	let options = {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: minFractionDigits,
		maximumFractionDigits: maxFractionDigits,
	}

	if (currency === 'ETH') {
		options = {
			style: 'decimal',
			minimumFractionDigits: minFractionDigits,
			maximumFractionDigits: maxFractionDigits,
		}
		symbol = 'Ξ'
		symbolPrepended = false
		cryptocurrency = true
	}

	if (currency === 'VETH') {
		options = {
			style: 'decimal',
			minimumFractionDigits: minFractionDigits,
			maximumFractionDigits: maxFractionDigits,
		}
		symbol = 'VETH'
		symbolPrepended = false
		cryptocurrency = true
	}

	const currencyValue = new Intl.NumberFormat(locales, options)

	return (
		cryptocurrency ? `${symbolPrepended ? symbol + '\u00A0' : ''}${currencyValue.format(amount)}${symbolPrepended ? '' : '\u00A0' + symbol}`
			: currencyValue.format(amount)
	)
}

const prettifyNumber = (amount, minFractionDigits = 0, maxFractionDigits = 0, locales = 'en-US') => {
	const options = {
		minimumFractionDigits: minFractionDigits,
		maximumFractionDigits: maxFractionDigits,
	}
	const value = isFinite(amount) ? amount : 0
	return (new Intl.NumberFormat(locales, options).format(value))
}

const getPercentage = (amount, minFractionDigits = 0, maxFractionDigits = 2, locales = 'en-US') => {
	const options = {
		style: 'percent',
		minimumFractionDigits: minFractionDigits,
		maximumFractionDigits: maxFractionDigits,
	}
	const value = isFinite(amount) ? amount : 0
	return (new Intl.NumberFormat(locales, options).format(value))
}

const getSecondsToGo = (date) => {
	const time = (Date.now() / 1000).toFixed()
	return (Number((date - time)))
}

const getVetherValueStrict = async (amount, currentBurn, emission) => {
	let value = (+amount / (+amount + currentBurn)) * emission
	value = value < 0 || isNaN(value) ? 0 : value
	return value
}

export { prettifyAddress, prettifyCurrency, prettifyNumber, getPercentage, getSecondsToGo, getVetherValueStrict }
