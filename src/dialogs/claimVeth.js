import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import {
	Flex, Heading, Select, Button,
} from '@chakra-ui/react'
import { useWallet } from 'use-wallet'
import { getEmissionEra, getDaysContributed, getEachDayContributed, getShare } from '../common/ethereum'
import { getAvailableEras, prettifyCurrency } from '../common/utils'

export const ClaimVeth = () => {

	const wallet = useWallet()
	const [emissionEra, setEmissionEra] = useState(undefined)
	const [availableEras, setAvailableEras] = useState(undefined)
	const [eachDayContributed, setEachDayContributed] = useState(undefined)
	const [era, setEra] = useState(undefined)
	const [day, setDay] = useState(undefined)
	const [share, setShare] = useState(undefined)

	useEffect(() => {
		getEmissionEra(defaults.network.provider)
			.then(n => setEmissionEra(n.toNumber()))
	}, [])

	useEffect(() => {
		getAvailableEras(emissionEra)
			.then(a => setAvailableEras(a))
	}, [emissionEra])

	useEffect(() => {
		if(wallet.account && emissionEra) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getDaysContributed(emissionEra, wallet.account, provider)
				.then((d) => {
					getEachDayContributed(d.toNumber(), emissionEra, wallet.account, provider)
						.then(c => setEachDayContributed(c))
				})
		}
	}, [era, wallet])

	useEffect(() => {
		if(wallet.account && era && day) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getShare(ethers.BigNumber.from(era), ethers.BigNumber.from(day), wallet.account, provider)
				.then((s) => {
					setShare(ethers.utils.formatEther(s))
				})
		}
	}, [day])

	return (
		<>
			<Flex flexFlow='column' h='20%'>
				<Heading as='h3' size='md' textAlign='center' m='-4px 0 11px 0'>CLAIM VETHER</Heading>
				<span>Claim your share of a previous day’s emission.</span>
			</Flex>

			<Flex flexFlow='column' h='20%'>
				<Heading as='h3' size='sm' mb='11px'>Emission Era</Heading>
				<Select isRequired
				 placeholder='Select available era'
				 onChange={(event) => {
						setEra(event.target.value)
					}}
				 variant='filled'>
					{availableEras && availableEras.map((e, index) => {
						return (
							<option value={e} key={index}>{e}</option>
						)
					})}
				</Select>
			</Flex>

			<Flex flexFlow='column' h='20%'>
				<Heading as='h3' size='sm' mb='11px'>Emission Day</Heading>
				<Select isRequired
				 placeholder='Select available day'
				 onChange={(event) => {
						setDay(event.target.value)
					}}
				 variant='filled'>
					{eachDayContributed && eachDayContributed.map((d, index) => {
						return (
							<option value={d} key={index}>{d}</option>
						)
					})}
				</Select>
			</Flex>

			<Flex flexFlow='column' h='20%'>
				<Heading as='h3' textAlign='center'>
					{isNaN(share) ? prettifyCurrency(0, 0, 2, 'VETH') : prettifyCurrency(share, 0, 2, 'VETH')}
				</Heading>
				<Heading as='span' size='sm' fontWeight='normal' textAlign='center'>Acquired share</Heading>
			</Flex>

			<Flex flexFlow='column' h='20%'>
				<Button w='100%'
					loadingText='Submitting'
				>
					Claim
				</Button>
			</Flex>
		</>
	)
}