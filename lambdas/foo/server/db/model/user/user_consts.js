'use strict';

const UNVERIFIED = 'unverified',
    VERIFIED = 'verified',
    BOUNCED = 'bounced',
    EMAIL_STATES = [UNVERIFIED, VERIFIED, BOUNCED];
module.exports = {
    EMAIL_STATES: EMAIL_STATES,
    UNVERIFIED: UNVERIFIED,
    VERIFIED: VERIFIED,
    BOUNCED: BOUNCED
};
