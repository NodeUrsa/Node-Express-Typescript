export type Quantity = number;

export interface ConvertTypeParams {
    quantity: number;
    unit: string;
}

export function convertUnits(parameters: ConvertTypeParams): Quantity{
    let quantity: Quantity = 0;

    switch (parameters.unit) {
        case 'oz': {
            quantity = parameters.quantity * 29.5735296875;
            break;
        }
        case 'liter': {
            quantity = parameters.quantity * 1000;
            break;
        }
        case 'cup': {
            quantity = parameters.quantity * 236.588;
            break;
        }
        default: {
            quantity = parameters.quantity;
            break;
        }
    }

    quantity = Math.round(quantity);
    return quantity;
}
