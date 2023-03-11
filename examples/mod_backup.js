(async () => {
    const modio = require('modio.js');
    const fs = require('fs');
    const inquirer = await import('inquirer').then(m => m.default);
    
    if (!fs.existsSync(__dirname + '/oauth.txt')) {
        const prompt = await inquirer.prompt({type: 'input', message: 'You do not have an OAuth key set. Please input your OAuth key (read + write): ', name: 'oauth'});
        fs.writeFileSync(__dirname + '/oauth.txt', prompt.oauth, 'utf8');
    }

    modio.setOAuthKey(fs.readFileSync(__dirname + '/oauth.txt'));

    const subscribed = await modio.getSubscriptions();

    const mods = [];
    const parsed = [];
    for (const mod of subscribed) {
        mods.push(mod.mod_url);
        const game = mod.mod_url.match(/\/g\/(.*?)\/m\//);
        const modname = mod.mod_url.split('/m/')[1];
        parsed.push({game: '@' + game, mod: '@' + modname});

    }
    const resstring = mods.join('&');
    fs.writeFileSync(__dirname + '/modsbackup.txt', resstring, 'utf8');
    for (const mod of parsed) {
        setTimeout(async () => {
            await modio.unsubscribeFrom(mod.game, mod.mod);
        }, 1000)
    }
    const data = fs.readFileSync(__dirname + '/modimport.txt');
    // Originally made for DRG mod syncing, feel free to adapt if needed.
    const imports = data.replace(/\nDisabled:.*/s, '').replace('Enabled:\n', '');
    for (const first of imports.split(': ')) {
        for (const mod of first.split('\n')) {
            const game = mod.match(/\/g\/(.*?)\/m\//);
            const modimport = mod.split('/m/')[1];
            setTimeout(async () => {
                await modio.subscribeTo(`@${game}`, `@${modimport}`);
            }, 1000)
        }
    }
})
