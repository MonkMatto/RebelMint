import { CardProps } from '../../contract/typeInterfacing'

function removeTrailingZeros(num: number | BigInt | string) {
    // Convert the number to a string
    let str = num.toString()

    // Check if the number contains a decimal point
    if (str.indexOf('.') !== -1) {
        // Remove trailing zeros
        str = str.replace(/\.?0+$/, '')
    }

    return str
}
function divideBigIntByPowerOf10(bigIntValue: BigInt, exponent: number) {
    // Convert BigInt to string
    let strValue = bigIntValue.toString()

    // Calculate the position of the decimal point
    let decimalPosition = strValue.length - exponent

    if (decimalPosition > 0) {
        // Insert decimal point
        return removeTrailingZeros(
            strValue.slice(0, decimalPosition) +
                '.' +
                strValue.slice(decimalPosition)
        )
    } else {
        // Add leading zeros
        return removeTrailingZeros(
            '0.' + '0'.repeat(-decimalPosition) + strValue
        )
    }
}

export const RMTokenCard = ({
    token,
    tokenIndex,
    setSelectionIndex = () => {},
    selectionIndex,
}: CardProps) => {
    if (token) {
        const {
            name,
            created_by,
            image,
            max_supply,
            decimals,
            current_supply,
            currency_details,
            token_cost,
            is_token_sale_active,
        } = token

        const creator = created_by ? created_by : '...'

        // const decimalMult =
        //     BigInt(10) **
        //     BigInt(decimals ? decimals : currency_details.decimals)

        //For Contract v0, ETH token cost is costToSend while erc20 token cost is costToDisplay

        const costInCurrency = divideBigIntByPowerOf10(
            BigInt(token_cost),
            Number(decimals ? decimals : currency_details.decimals)
        ) //Number(BigInt(token_cost) / decimalMult)
        console.log(costInCurrency)
        const costToDisplay =
            Number(costInCurrency) < 0.0000001 ? '< 0.000001' : costInCurrency

        const supplyIndicator =
            current_supply && max_supply
                ? current_supply + ' / ' + max_supply.toString()
                : ''

        const style = {
            '--image-url': ` url(${image})`,
        } as React.CSSProperties

        const SaleConditionDot = () => {
            if (is_token_sale_active) {
                return (
                    <div className="ml-1 aspect-square h-2/5 rounded-full bg-green-400"></div>
                )
            } else {
                return (
                    <div className="ml-1 aspect-square h-2/5 rounded-full bg-red-400"></div>
                )
            }
        }

        if (tokenIndex == selectionIndex) {
            // Show that this token IS selected
            return (
                <div
                    className="bg-base-800 box-border flex h-full w-full scale-105 flex-col justify-between rounded-lg border-2 border-textcol align-middle duration-200 hover:bg-cardhover"
                    onClick={() => setSelectionIndex(tokenIndex)}
                >
                    <div
                        className="m-2 box-content aspect-square w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                        style={style}
                    />
                    <div className="bg-base-800 flex w-full flex-col p-2">
                        <div className="mb-4 mt-3">
                            <p className="truncate text-lg">{name}</p>
                            <p className="truncate text-sm font-light">
                                {creator}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-between align-middle">
                            <div className="flex h-5 flex-row justify-start align-middle">
                                <p className="text-sm">
                                    {costToDisplay.toString() +
                                        ' ' +
                                        currency_details.symbol}
                                </p>
                            </div>
                            <div className="flex h-5 items-center justify-end">
                                <p className="text-sm">{supplyIndicator}</p>

                                <SaleConditionDot />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (tokenIndex != selectionIndex || selectionIndex == null) {
            //Show that this token IS NOT selected
            return (
                <div
                    className="bg-base-900 border-base-800 hover:bg-base-700 hover:border-base-700 box-border flex h-full w-full flex-col items-center justify-around rounded-lg border-2 align-middle duration-200"
                    onClick={() => setSelectionIndex(tokenIndex)}
                >
                    <div
                        className="m-2 box-content aspect-square w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                        style={style}
                    />
                    <div className="bg-base-800 flex w-full flex-col p-2">
                        <div className="mb-4 mt-3">
                            <p className="truncate text-lg">{name}</p>
                            <p className="truncate text-sm font-light">
                                {creator}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-between align-middle">
                            <div className="flex h-5 flex-row justify-start align-middle">
                                <p className="text-sm">
                                    {costToDisplay.toString() +
                                        ' ' +
                                        currency_details.symbol}
                                </p>
                            </div>
                            <div className="flex h-5 items-center justify-end">
                                <p className="text-sm">{supplyIndicator}</p>

                                <SaleConditionDot />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return <></>
    }
}
