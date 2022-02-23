import * as crypto from "crypto";

export const globalValidators = () => `{global}:validators`
export const validatorClaims = () => `{validator}:claims`
export const validatorAliases = () => `{validator}:aliases`
export const generateClaim = content => crypto.createHash('sha256').update(content).digest('hex')
export const accessProps = access => `{access}:props:${access}`
export const accessValidators = access => `{access}:validators:${access}`
