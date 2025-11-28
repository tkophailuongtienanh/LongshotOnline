import * as signalR from "@microsoft/signalr";
import { API_URL } from "../api/config";

export const lobbyConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_URL}/lobby`, {
        withCredentials: false
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export const gameConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_URL}/gamehub`, {
        withCredentials: false
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();