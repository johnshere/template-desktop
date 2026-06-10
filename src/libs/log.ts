export function log() {
    console.log(
        `%c [${import.meta.env.APP_NAME}] %c v${import.meta.env.APP_VERSION} %c ${import.meta.env.APP_BUILD_TIME} `,
        'background:#0f172a;color:#fff;padding:2px 6px;border-radius:3px 0 0 3px',
        'background:#06b6d4;color:#fff;padding:2px 6px',
        'background:#e2e8f0;color:#0f172a;padding:2px 6px;border-radius:0 3px 3px 0'
    )
}
