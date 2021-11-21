This application allows the user to have their bank information relayed to them over the phone. 

# Authors:
* Joud El-Shawa
* Yusra Salam

# How to Run:

1. Clone the repo and install the dependencies:

```sh
git clone https://github.com/dasha-samples/HW8-bank-assist
cd HW8-bank-assist
npm install
```

2. Create or log into your account using the Dasha CLI tool:

```sh
npx dasha account login
```

3. Ensure you have everything you need for Dasha to run on your device:

https://docs.dasha.ai/en-us/default (if any, ensure you run "npm -i")

4. To receive a phone call from Dasha, run:

```sh
npm start <your phone number>
```

The phone number should be in the international format without the `+` (e.g. `12223334455`)
