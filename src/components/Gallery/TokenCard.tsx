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
    // selectionIndex,
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

        const creator = created_by ? created_by : ''

        //For Contract v0, ETH token cost is costToSend while erc20 token cost is costToDisplay

        const costInCurrency = divideBigIntByPowerOf10(
            BigInt(token_cost),
            Number(decimals ? decimals : currency_details.decimals)
        ) //Number(BigInt(token_cost) / decimalMult)
        const costToDisplay =
            Number(costInCurrency) < 0.0000001 ? '< 0.000001' : costInCurrency

        const supplyIndicator =
            current_supply && max_supply ? (
                <div className="flex w-full flex-col gap-1">
                    <span className="">
                        {' '}
                        <span className="text-base-300">{current_supply}</span>
                        {' / ' + max_supply.toString() + ' minted'}
                    </span>
                    <div className="h-1 w-full rounded-full bg-base-800">
                        <div
                            className="h-1 rounded-full bg-base-50"
                            style={{
                                width: `${(Number(current_supply) / Number(max_supply)) * 100}%`,
                            }}
                        ></div>
                    </div>
                </div>
            ) : (
                ''
            )

        const style = {
            '--image-url': ` url(${image})`,
        } as React.CSSProperties

        return (
            <div
                className="hover:bg-base-750 box-border flex h-full w-full cursor-pointer flex-col items-center justify-around overflow-hidden rounded-lg border-2 border-base-850 bg-base-900 align-middle duration-200 hover:border-base-700"
                onClick={() => setSelectionIndex(tokenIndex)}
            >
                <div
                    className="m-2 box-content aspect-square w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                    style={style}
                />
                <div className="flex h-full w-full flex-col justify-between rounded-b-md bg-base-850">
                    <div className="mb-4 mt-3 px-2">
                        <p className="truncate text-lg">{name}</p>
                        <p className="truncate text-sm font-light">{creator}</p>
                    </div>
                    <div className="flex flex-col flex-nowrap justify-between gap-4 bg-base-850 px-2 pb-2">
                        {is_token_sale_active && (
                            <div className="flex h-5 flex-row justify-start align-middle text-base-200">
                                <p className="text-sm">
                                    {costToDisplay.toString() +
                                        ' ' +
                                        currency_details.symbol}
                                </p>
                            </div>
                        )}

                        <p className="text-sm text-base-600">
                            {supplyIndicator}
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
