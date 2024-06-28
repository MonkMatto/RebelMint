import { useState } from 'react'
import { NewTokenProps } from '../../contract/typeInterfacing'
import contractABI from '../../contract/abi'
import close from './close.svg'
import {
    // useAccount,
    // useReadContract,
    // useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi'
interface FormStruct {
    price: string
    currencyAddress: `0x${string}`
    maxSupply: string
    uri: string
}

export const NewTokenPopUp = ({
    contractAddress,
    setSelectionIndex = () => {},
}: NewTokenProps) => {
    const { writeContractAsync, data: hash } = useWriteContract()
    const [useCustomToken, setUseCustomToken] = useState(false)
    const [form, setForm] = useState<FormStruct>({
        price: '',
        currencyAddress: '0x0000000000000000000000000000000000000000',
        maxSupply: '',
        uri: '',
    })

    const decimalMult =
        form.currencyAddress == '0x0000000000000000000000000000000000000000'
            ? 10 ** 18
            : 1
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }))
    }
    const createToken = async () => {
        console.log(BigInt(Number(form.price) * decimalMult))
        try {
            await writeContractAsync({
                abi: contractABI,
                address: contractAddress as `0x${string}`,
                functionName: 'createToken',
                args: [
                    BigInt(Number(form.price) * decimalMult),
                    form.currencyAddress as `0x${string}`,
                    BigInt(form.maxSupply),
                    form.uri,
                ],
            })
            console.log('Transaction sent successfully')
            console.log(hash)
        } catch (error) {
            console.error('Error sending transaction:', error)
        }
    }

    const inputClass =
        'flex-1 p-3 border h-2 bg-base-900 border-base-50 rounded-lg'

    return (
        <div
            onClick={() => {
                setSelectionIndex(-1)
            }}
            className="sticky inset-0 z-20 flex h-screen w-full items-center justify-center backdrop-blur-sm"
        >
            <div
                id="OM-popup-window"
                onClick={(e) => {
                    e.stopPropagation()
                }}
                className="bg-base-900 flex h-[75svh] w-4/5 flex-col justify-between overflow-y-auto rounded-lg p-5 lg:h-fit"
            >
                <div className="flex flex-col">
                    <img
                        src={close}
                        className="border-base-700 bg-base-800 h-fit w-fit self-end rounded-lg border p-2 text-center hover:cursor-pointer hover:bg-red-600"
                        onClick={() => setSelectionIndex(-1)}
                    />
                    <div className="flex h-fit flex-col justify-center gap-6 p-4 font-normal">
                        <h1 className="mb-6 text-5xl">Create New Token</h1>
                        <div className="flex flex-col gap-2">
                            <h3>
                                {form.currencyAddress ==
                                '0x0000000000000000000000000000000000000000'
                                    ? 'Price (ETH)'
                                    : 'Price (ERC-20)'}
                            </h3>
                            {useCustomToken && (
                                <p className="text-sm font-thin">
                                    Use full units for custom tokens
                                </p>
                            )}
                            <input
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className={inputClass + ' w-1/4'}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3>Max Supply</h3>
                            <input
                                name="maxSupply"
                                value={form.maxSupply}
                                onChange={handleChange}
                                className={inputClass + ' w-1/4'}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-end justify-start gap-5">
                                <h3>Currency Address</h3>
                                <p className="text-sm font-thin">
                                    Use only when accepting custom ERC-20
                                </p>
                            </div>
                            <button
                                className="h-fit w-fit self-start rounded-lg bg-cardhover p-1 text-sm font-thin text-textcol"
                                onClick={() => {
                                    if (useCustomToken) {
                                        setForm((prevform) => ({
                                            ...prevform,
                                            currencyAddress:
                                                '0x0000000000000000000000000000000000000000',
                                        }))
                                    }
                                    setUseCustomToken(!useCustomToken)
                                }}
                            >
                                {useCustomToken
                                    ? 'Use ETH'
                                    : 'Use Custom ERC-20'}
                            </button>
                            <input
                                name="currencyAddress"
                                value={form.currencyAddress}
                                disabled={!useCustomToken}
                                maxLength={42}
                                onChange={handleChange}
                                className={
                                    inputClass + ' disabled:invert-[20%]'
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3>Token URI</h3>
                            <input
                                name="uri"
                                value={form.uri}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                        <button
                            onClick={createToken}
                            className="mt-8 h-fit w-fit self-end rounded-lg bg-textcol p-4 text-bgcol"
                        >
                            {'Create Token'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
