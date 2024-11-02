export interface AptpPaymentResponse {
    requestId:    number;
    status:       Status;
    request:      Request;
    payment:      PaymentElement[];
    subscription: null;
}

export interface PaymentElement {
    amount:            PurpleAmount;
    status:            Status;
    receipt:           string;
    refunded:          boolean;
    franchise:         string;
    reference:         string;
    issuerName:        string;
    authorization:     string;
    paymentMethod:     string;
    processorFields:   Field[];
    internalReference: number;
    paymentMethodName: string;
}

export interface PurpleAmount {
    to:     FromClass;
    from:   FromClass;
    factor: number;
}

export interface FromClass {
    total:    number;
    currency: string;
}

export interface Field {
    value:     number | string;
    keyword:   string;
    displayOn: string;
}

export interface Status {
    date:    Date;
    reason:  string;
    status:  string;
    message: string;
}

export interface Request {
    locale:     string;
    payer:      Payer;
    payment:    RequestPayment;
    fields:     Field[];
    returnUrl:  string;
    ipAddress:  string;
    userAgent:  string;
    expiration: Date;
}

export interface Payer {
    document:     string;
    documentType: string;
    name:         string;
    surname:      string;
    email:        string;
    mobile:       string;
}

export interface RequestPayment {
    reference:    string;
    description:  string;
    amount:       FromClass;
    allowPartial: boolean;
    subscribe:    boolean;
}
