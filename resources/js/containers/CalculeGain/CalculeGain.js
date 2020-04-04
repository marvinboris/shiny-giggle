import React, { Component } from 'react'


export default class CalculeGain extends Component {
    componentDidMount() {
        const balances = [];
        for (let index = 0; index < 52; index++) {
            balances.push({ balance: this.CalculGain(6, index + 1, 260), period: index + 1 });
        }
        console.log(balances.sort((a, b) => a.balance - b.balance));
        console.log(this.CalculGain(10, 52, 260))
    }

    CalculGain = (Pa, P, D) => {
        const packs = [
            { value: 100, percentage: 1.6 },
            { value: 200, percentage: 1.7 },
            { value: 400, percentage: 1.8 },
            { value: 800, percentage: 1.9 },
            { value: 1600, percentage: 2 },
            { value: 3200, percentage: 2.05 },
            { value: 6400, percentage: 2.1 },
            { value: 12800, percentage: 2.15 },
            { value: 25600, percentage: 2.2 },
            { value: 51200, percentage: 2.24 },
            { value: 100000, percentage: 2.25 },
        ];

        const initialPack = packs[Pa];

        const totalPeriods = Math.floor(D / P);
        const packPeriod = Math.floor(52 / P);
        const floatingPackPeriod = (52 / P) - packPeriod;

        let balance = 0;
        const ownedPacks = [];

        ownedPacks.push([initialPack]);

        const Rpa = pack => pack.value * pack.percentage * P / 52;
        const round = number => {
            if (Math.ceil(number) - number < 0.0001) return Math.ceil(number);
            return number;
        };

        for (let currentPeriod = 0; currentPeriod <= totalPeriods; currentPeriod++) {
            const leftPacks = [];
            ownedPacks.forEach((ownedPeriodPacks, period) => {
                if (currentPeriod - period < packPeriod) {
                    // console.log("ownedPeriodepacks " + period + JSON.stringify(ownedPeriodPacks))
                    leftPacks.push(ownedPeriodPacks);
                    ownedPeriodPacks.forEach(ownedPack => balance += Rpa(ownedPack));
                }
                else if (currentPeriod - period === packPeriod + 1 && floatingPackPeriod > 0)
                    ownedPeriodPacks.forEach(ownedPack => balance += floatingPackPeriod * Rpa(ownedPack));
            });
            balance = round(balance);

            if (totalPeriods - currentPeriod > packPeriod) {
                const selectedPacks = [];
                // while (balance >= 100) {
                while (balance >= 100) {
                    const availablePacks = packs.filter(({ value }) => value <= balance);
                    const selectedPack = availablePacks[availablePacks.length - 1];
                    selectedPacks.push(selectedPack);
                    balance -= selectedPack.value;
                }
                ownedPacks.push(selectedPacks);
            }
            // console.log("Periode " + (currentPeriod + 1) + " Balance: " + balance + " Pack total:" + (ownedPacks.length))
            // console.log("Pack list " + JSON.stringify(leftPacks))
        }

        return balance;
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
