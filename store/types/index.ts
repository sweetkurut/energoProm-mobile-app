// это для регситрации
export interface ISignUpEmail {
    email: string;
}

export interface ISignUpEmailResponse {
    id: string;
    email: string;
}

export interface IVerifyCode {
    email: string;
    verification_code: string;
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface ILoginResponse {
    id: number;
    email: string;
    refresh: string;
    access: string;
}

export interface ISetPassword {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

export interface ISetPasswordResponse {
    status: number;
    id: number;
    name: string;
    user: string;
    refresh: string;
    access: string;
}

export interface IRefreshTokenResponse {
    refresh: string;
    access: string;
}
export interface IResetPassword {
    email: string;
    code: string;
    new_password: string;
}

// тут короче профиль
export interface IProfile {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    registered_at: string;
    updated_at: string;
}

export interface IProfileUpdate {
    name: string;
    email: string;
    avatar: string;
}

export interface IProfileUpdatePassword {
    old_password: string;
    new_password: string;
}

// хаускард

//  HouseCard POST (создание/обновление)

export interface HouseCardCreate {
    personal_account: number;
    contract_number: number;
    contract_date: string;
    tp_number: number;
    household_needs: number;
    fact_summer: number;
    fact_winter: number;
    max_summer: number;
    max_winter: number;
    address: AddressPost;
    user: number;
    plot: number;
    route: number;
    counter: CounterPost;
    tariff: number;
}

export interface AddressPost {
    house: string;
    liter: string;
    apartment: number;
    apartment_liter: string;
    street: number; // <-- ID улицы
}

export interface CounterPost {
    serial_number: string;
    pp_number: number;
    current_indication: number;
    year_of_state_inspection: number;
    quarter_of_state_inspection: number;
    energy_sales_seal: string;
    CRPU_seal: string;
    seal_on_the_casing: string;
    cause: number;
    executor: number;
    counter_type: number;
}

// HouseCard GET (ответ от сервера)
export interface IHouseCardResponse {
    id: number;
    personal_account: number;
    contract_number: number;
    contract_date: string;
    tp_number: number;
    household_needs: number;
    fact_summer: number;
    fact_winter: number;
    max_summer: number;
    max_winter: number;
    registered_at: string;
    updated_at: string;
    user: number;
    address: AddressGet;
    plot: Plot;
    route: Route;
    counter: CounterGet;
    tariff: Tariff;
}

// новый тип для нового запроса housecard
export interface HouseCard {
    id: number;
    house_card: string;
    address: {
        street: {
            name: string;
        };
        house: string;
        liter: string;
        apartment: string;
        apartment_liter: string;
    };
    tariff: {
        id: number;
        name: string;
        NDS: number;
        NSP: number;
        kw_cost: string;
        pricing_type: string;
        tariff_band: {
            id: number;
            min_kwh: string;
            max_kwh: string | null;
            price_per_kwh: string;
            order: number;
        }[];
        created_at: string;
        updated_at: string;
    };
    contract_date: string;
}

// house card detail
export interface HouseCardDetail {
    id: number;
    personal_account: number;
    contract_number: number;
    contract_date: string;
    tp_number: number;
    household_needs: number;
    fact_summer: number;
    fact_winter: number;
    max_summer: number;
    max_winter: number;
    registered_at: string;
    updated_at: string;
    user: number;
    address: AddressGet;
    plot: Plot;
    route: Route;
    counter: CounterGet;
    tariff: Tariff;
}

export interface AddressGet {
    detail: ReactNode;
    // detail: ReactN;
    house: string;
    liter: string;
    apartment: number;
    apartment_liter: string;
    street: Street;
}

export interface Street {
    id: number;
    name: string;
    settlement: Settlement;
}

export interface Settlement {
    id: number;
    name: string;
    administration: Administration;
}

export interface Administration {
    id: number;
    name: string;
    district: District;
}

export interface District {
    id: number;
    name: string;
}

export interface Plot {
    id: number;
    name: string;
    code: number;
    controller: string;
}

export interface Route {
    id: number;
    route_number: number;
    plot: Plot;
    executor: Executor;
}

export interface Executor {
    id: number;
    name: string;
}

export interface CounterGet {
    serial_number: string;
    pp_number: number;
    current_indication: number;
    year_of_state_inspection: number;
    quarter_of_state_inspection: number;
    energy_sales_seal: string;
    CRPU_seal: string;
    seal_on_the_casing: string;
    cause: Cause;
    executor: Executor;
    counter_type: CounterType;
}

export interface Cause {
    id: number;
    name: string;
}

export interface CounterType {
    id: number;
    model: string;
    significance: number;
    amperage_range: string;
    current_transformation_ratio: number;
}

export interface Tariff {
    id: number;
    name: string;
    NDS: number;
    NSP: number;
    kw_cost: number;
}

// чеки
export interface LastCheck {
    id: number;
    house_card: {
        house_card: number;
        address: {
            street: {
                name: string;
            };
            house: string;
            liter: string;
            apartment: number;
            apartment_liter: string;
        };
        route: {
            route_number: number;
            executor: {
                name: string;
            };
        };
        overpayment_underpayment: number;
        penalty: number;
    };
    username: {
        id: number;
        name: string;
    };
    tariff: {
        id: number;
        name: string;
        NDS: number;
        NSP: number;
        kw_cost: number;
        created_at: string;
        updated_at: string;
    };
    consumption: number;
    amount_for_expenses: number;
    previous_check: number;
    previous_check_date: string;
    current_check: number;
    current_check_date: string;
    period_day_count: number;
    pay_for_electricity: number;
    total_sum: number;
    counter_photo: string;
    counter_current_check: number;
    created_at?: string;
    updated_at?: string;
}

// графики
// Этот интерфейс описывает один элемент графика, который находится внутри массива
export interface GraphicItem {
    created_at: string;
    consumption: number | null;
    current_check_date: string | null;
    month_name: string;
}

// Этот новый интерфейс описывает полную структуру ответа от API
export interface GraphicData {
    average_consumption: number;
    diff_amount: number;
    diff_percent: number;
    graphic_evaluate: GraphicItem[]; // Здесь мы указываем, что это массив GraphicItem
}
// сделки

export interface Deal {
    id: number;
    date_of_deal: string;
    address: string;
    status: string; // при желании сузить: 'new' | 'in_progress' | 'done' | ...
    phone_number: string;
    description: string;
    created_at: string;
    updated_at: string;
    user: number;
    bid: number;
}

export interface CreateDeal {
    address: string;
    status: string; // при желании сузить: 'new' | 'in_progress' | 'done' | ...
    phone_number: string;
    description: string;
    user: number;
    bid: number;
}

export interface DealDetail {
    id: number;
    date_of_deal: string;
    address: string;
    status: string; // при желании сузить: 'new' | 'in_progress' | 'done' | ...
    phone_number: string;
    description: string;
    created_at: string;
    updated_at: string;
    user: number;
    bid: number;
}

export interface Bid {
    id: number;
    name: string;
    description: string;
    icon: string;
    created_at: string;
    updated_at: string;
}
export interface BidDetail {
    id: number;
    name: string;
    description: string;
    icon: string;
    created_at: string;
    updated_at: string;
}

// PATCH-запрос на фото со стороны пользователя
export interface UpdateCheckUser {
    counter_current_check: number;
}

// create payment
export type CommissionType = "percent" | "fixed";

export interface PaymentMethod {
    logo: string;
    name: string;
    link: string;
    active: number;
    order_num: number;
}

export interface PaymentResponse {
    requisite: string;
    sum: string;
    urls: PaymentMethod[];
}

export interface PaymentPreviewResponse {
    comservice: string;
    comservice_name: string;
    com_account: string;
    total: string;
    comission: number;
    total_with_comission: number;
    comission_type: CommissionType;
    comission_value: number;
}

export interface PaymentPreviewState {
    loading: boolean;
    error: null | string;
    previewData: PaymentPreviewResponse | null;
}

export interface PaymentHistory {
    id: number;
    check_id: number;
    house_card_id: number;
    user_id: string;
    requisite: string;
    txn_id: string;
    source: string;
    amount: string;
    paid_date: string;
    created_at: string;
}

// Интерфейс для параметров запроса
export interface PaymentHistoryParams {
    checkId?: number;
    userId?: number;
}

// ОБЪЕДИНЕННЫЙ интерфейс для состояния платежей
export interface PaymentState {
    // Основные поля для создания платежа
    loading: boolean;
    error: null | string;
    paymentMethods: PaymentMethod[];
    requisite: string;
    sum: string;

    // Поля для истории платежей
    payments: PaymentHistory[]; // ДОБАВЛЕНО

    // Поля для превью
    preview: PaymentPreviewState;
}

// Старый интерфейс можно удалить или оставить как alias
export type PaymentHistoryState = PaymentState;

export interface PaymentsApi {
    getPaymentsHistory: (
        checkId?: number,
        userId?: number
    ) => Promise<{
        data: PaymentHistory[];
        status: number;
    }>;
}
