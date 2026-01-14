import type { Decimal, JsonValue } from "@prisma/client/runtime/client";

export interface IProduct {
    uuid: string;
    created_at: Date;
    name: string;
    description: string;
    product_type: string;
    image: string;
    features?: string[];
    acronym?: string | null;
    composition: JsonValue; 
}

export interface IUser {
    user_id: string;
    name: string;
    email: string;
    password: string;
    user_type: string;    
}

export interface IRegister {
    register_id: string;
    title: string;
    description: string | null;
    deliver_observation: string | null;
    created_at: Date;
    deadline: Date;
    status: string;
    product_quantity: Decimal;
    delivered_at: Date | null;
    cut_assistant: string | null;
    fold_assistant: string | null;
    finishing_assistant: string | null;
    paint_assistant: string | null;
    employee_uuid: string | null;
    product_uuid: string;
    client_uuid: string;
}

export interface IGoal {
    goal_id: string;
    created_at: Date;
    title: string;
    description: string | null;
    goal_type: string;
    deadline: Date;
    employee_goal: string | null;
}

export interface IEmployee {
    employee_id: string;
    name: string;
    employee_type: string;
}