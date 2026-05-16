'use server'
import { createClient } from '@/lib/supabase/server'

export async function getAllReastaurant(){
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("Review")
        .select("*")
    
}

export async function addRestaurant(){
    const supabase = await createClient()
}

export async function deleteRestaurant(){}

export async function filterRestaurant(){}