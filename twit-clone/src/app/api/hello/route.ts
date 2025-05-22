import { NextResponse, NextRequest } from "next/server";

/**
 * @param {NextRequest} request
 */
export async function POST(request: Request) {
    const body = await request.json();
    console.log('User input: ', body.text);

    return NextResponse.json({message: 'Received: ' + body.text });
}