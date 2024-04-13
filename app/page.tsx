"use client"
import './globals.css';
import { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import LogRoll from "./log"
import Card from "./Card";
import MyMonster from "./MyMonster";
import monsters from "./Monsters.json";
import HomebrewMonsters from "./HomebrewMonsters.json";

export default function Monsters() {
    const [filteredMonsters, setFilteredMonsters] = useState<any>([]);
    const [myMonsters, setMyMonsters] = useState<any>([]);
    const [diceLog, setDiceLog] = useState<LogRoll[]>([]);
    const [showLog, setShowLog] = useState("inherit");
    const [search, setSearch] = useState("");
    const [CRfilter, SetCRfilter] = useState("0-2");

    const toggleLog = function() {
        if(showLog === "inherit") {
            setShowLog("none")
        } else {
            setShowLog("inherit");
        }
    }

    useEffect(() => {
        let min = Number(CRfilter[0]);
        let max = Number(CRfilter[2]);
        setFilteredMonsters(monsters.results.concat(HomebrewMonsters).filter((m) => (m.slug.includes(search) && m.cr>=min &&m.cr<=max)));
    }, [search, monsters, CRfilter]);

    return (
        <div  data-bs-theme="dark" className="text-light m-3">
            {/* Dice Log */}
            { diceLog.length>0 ?
                <div className='fixed bottom-2 right-2'>
                    <div style={{display:showLog}}>
                        {diceLog.map((msg: LogRoll, index) => (
                            <Toast key={index} onClose={() => setDiceLog(diceLog.filter((item, i) => i !== index))}>
                                <Toast.Header>
                                    <div className="me-auto">
                                        {msg.creature}
                                    </div>
                                </Toast.Header>
                                <Toast.Body>{msg.type}:{msg.dice}:{msg.result}</Toast.Body>
                            </Toast>
                        ))}
                    </div>
                    <button className="btn btn-primary float-end" onClick={toggleLog}>X</button>
                </div> : <></>}
            <h1>Straight Roll</h1>
            <input id='straight-roll' type="text" className="form-control focus:bg-red-50" onKeyDown={(e) => {
                if(e.key === "Enter"){setDiceLog([...diceLog, new LogRoll("manual", "", (e.target as HTMLInputElement).value)])}}}></input>
            <h1>My Monsters</h1>
            {myMonsters.map((myMonster: any, index: number) => (
                <MyMonster key={index} monster={myMonster} 
                    onRoll={(type: string, dice: string) => setDiceLog([...diceLog, new LogRoll(myMonster.name+index, type, dice)])}
                    onDelete={() => setMyMonsters(myMonsters.filter((item: any, i: number) => i !== index))} />
                //<MyMonster key={index} uri="/api/monsters/giant-boar" />
            ))}
            <h1>All Monsters</h1>
            <div className="form-floating mb-3">
                <label htmlFor='search-monster'>Search Monster</label>
                <input id='search-monster' type="text" className="form-control" onChange={(event) => setSearch(event.target.value)} placeholder=""></input>
            </div>
            <div className="form-floating mb-3">
                <label htmlFor='CRfilter'>Challenge Rating (0-2)</label>
                <input id="CRfilter" type="text" className="form-control" placeholder="0-2"
                    onChange={(e) => SetCRfilter(e.target.value)}></input>
                
            </div>

            <div className="flex flex-wrap">
            {filteredMonsters.map((monster: any, index: number) => (
                <Card key={index} monster={monster} onAdd={() => setMyMonsters([...myMonsters, monster])} index={index} />
            ))}
            </div>
        </div>
    );
}