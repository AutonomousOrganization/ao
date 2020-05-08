
### Install
AO is a vuejs web app and nodejs server. Install node dependencies
```
npm install
```
To be fully setup ao requires
- sqlite3 - `~/.ao/database.sqlite3` store events and backups
- [tor](https://dist.torproject.org) - `/usr/local/etc/tor/torrc` configure onion address

- [clightning](https://github.com/ElementsProject/lightning) - `~/.lightning/` directory for lightning node

Install all with setup script on linux, *may need to be ran multiple times*
```
npm run setup
```
Start server on localhost:8003
```
npm run compile
```
Wallet requires a bitcoin node. Private key of wallet is the `~/.lightning/bitcoin/hsm_secret` file.
There is another repo [pi](https://github.com/autonomousorganization/pi) that creates a resource.
### AO is
A realized autonomy project. A [website](localhost:8003). A blank sheet of paper. An onion. A memory castle. An invitation to examine *do you(?)* what do you do?

#### Layout
Center top helm - view and change the **mode**. Center bottom palette - use textarea to create new cards *and search all*.

**Boat** - Priorities - list of tasks, to do.
**Timecube** - Planning- view calendar past completions time on current and sub
**Chest** - Payments - points indicate payment has been recieved.
**Badge** - Checkmarks - See accounts, what have they done, see clock totals.

Each mode has an overview (top left) and settings (top right).

#### Degrees of Existence
1. thought of
2. written down
3. resolve to act *(up boat)*
4. acted upon *(checkmark)*
5. result evaluated


    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    Upon giant shoulders:
        Linux, Ubuntu, Nodejs, Vuejs, Sqlite3, Tor,
        Bitcoind, Clightning, Firefox, Atom
    Software that respects users starts with being open source.
###### Development: fpjfgsclyjgcv6r4wzp7lk52ut2v2v2nt2bmlhm44yanx2twdjoh2iqd.onion
###### Donations: 3AA6s5MUnLjPzi2iPzUGVqWGAGBBJnBiWg
