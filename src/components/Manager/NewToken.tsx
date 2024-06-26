import { useState } from 'react'
import { NewTokenProps } from '../../contract/typeInterfacing'
import contractABI from '../../contract/abi'
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

    const toggleSale = async () => {
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

    const inputClass = 'flex-1 p-3 border-2 bg-bgcol border-textcol rounded-lg'

    return (
        <div
            onClick={() => {
                setSelectionIndex(-1)
            }}
            className="absolute z-20 flex h-full w-full items-center justify-center backdrop-blur-sm"
        >
            <div
                onClick={(e) => {
                    e.stopPropagation()
                }}
                className="relative flex h-4/5 w-4/5 flex-col justify-between rounded-lg bg-bghover p-5"
            >
                <p
                    className="absolute right-0 top-[-5%] z-0 h-fit rounded-t-lg bg-bghover p-2 text-center hover:cursor-pointer hover:bg-cardhover"
                    onClick={() => setSelectionIndex(-1)}
                >
                    X
                </p>
                <div className="flex flex-col gap-4">
                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className={inputClass}
                    />
                    <input
                        name="currencyAddress"
                        value={form.currencyAddress}
                        maxLength={42}
                        onChange={handleChange}
                        placeholder="Currency Address"
                        className={inputClass}
                    />
                    <input
                        name="maxSupply"
                        value={form.maxSupply}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Max Supply"
                    />
                    <input
                        name="uri"
                        value={form.uri}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Token URI"
                    />
                    <button
                        onClick={createToken}
                        className="h-fit w-fit self-end rounded-lg bg-textcol p-4 text-bgcol"
                    >
                        {'Create'}
                    </button>
                </div>
            </div>
        </div>
    )
}
