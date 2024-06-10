import { CardProps } from '../../contract/versioning/typeInterfacing'

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
            current_supply,
            token_cost,
            currency_address,
        } = token
        const currencySymbol =
            currency_address == '0x0000000000000000000000000000000000000000'
                ? ' ETH'
                : ' TEMP'
        const creator = created_by ? created_by : '...'
        // const currency = UseTokenParameters(token.currency_address)
        const costToDisplay =
            Number(token_cost) / 1000000000000000000 < 0.000001
                ? '< 0.000001'
                : Number(token_cost) / 1000000000000000000

        const supplyIndicator =
            current_supply && max_supply
                ? current_supply + ' / ' + max_supply.toString()
                : ''

        const style = {
            '--image-url': ` url(${image})`,
        } as React.CSSProperties
        if (tokenIndex == selectionIndex) {
            // Show that this token IS selected
            return (
                <div
                    className="border-textcol bg-card hover:bg-cardhover box-border flex h-full w-full scale-105 flex-col justify-between rounded-lg border-2 p-2 align-middle duration-200"
                    onClick={() => setSelectionIndex(tokenIndex)}
                >
                    <div
                        className="aspect-square w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                        style={style}
                    />
                    <div className="flex w-full flex-col">
                        <div className="mb-4 mt-3">
                            <p className="truncate text-xl">{name}</p>
                            <p className="truncate text-sm font-light">
                                {creator}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-between align-middle">
                            <div className="flex h-5 flex-row justify-start align-middle">
                                <p className="text-sm">
                                    {costToDisplay.toString() + currencySymbol}
                                </p>
                            </div>
                            <p className="text-sm">{supplyIndicator}</p>
                        </div>
                    </div>
                </div>
            )
        } else if (tokenIndex != selectionIndex || selectionIndex == null) {
            //Show that this token IS NOT selected
            return (
                <div
                    className="border-bgcol bg-card hover:bg-cardhover box-border flex h-full w-full flex-col justify-between rounded-lg border-2 p-2 align-middle duration-200"
                    onClick={() => setSelectionIndex(tokenIndex)}
                >
                    <div
                        className="aspect-square w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                        style={style}
                    />
                    <div className="flex w-full flex-col">
                        <div className="mb-4 mt-3">
                            <p className="truncate text-lg">{name}</p>
                            <p className="truncate text-sm font-light">
                                {creator}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-between align-middle">
                            <div className="flex h-5 flex-row justify-start align-middle">
                                <p className="text-sm">
                                    {costToDisplay.toString() + currencySymbol}
                                </p>
                            </div>
                            <p className="text-sm">{supplyIndicator}</p>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return <></>
    }
}
