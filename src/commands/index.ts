import SlashCommand from "../classes/slash_command";
import help from "./help";
import ping from "./ping";
import upload from "./upload";

export default [
    ping,
    help,
    upload,
] as SlashCommand[];
