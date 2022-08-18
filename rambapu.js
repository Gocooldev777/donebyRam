/* 
Input:
bill_number:1 A 1000 B 2000 C 1000
bill_number:2 A 300 B 400 C 100 D 200
bill_number:3 A 3000 B 100 D 200

Explanation:
bill_number:1 total=4000 average=1333.33 
bill_number:2 total=1000 average=250
bill_number:3 total=3300 average=1100

A contribution = 2683.33
B contibtution = 2683.33
C contribution = 1583.33
D contribution = 1350

A paid = 4300
B paid = 2500
C paid = 1100
D paid = 400

A remaining = +1616.67 
B remaining = -183.33
C remaining = -483.33
D remaining = -950.00

Summary:
D has to pay A : Rs.950 
C has to pay A : Rs.483.33 
B has to pay A : Rs.183.33 
*/

//Input transactions
state = {
    transactions : [
        { bill_number:1,paid_by:'A',amount:2000 },
        { bill_number:1,paid_by:'B',amount:200 },
        { bill_number:1,paid_by:'C',amount:1000 },
        { bill_number:2,paid_by:'A',amount:1500  },
        { bill_number:2,paid_by:'B',amount:0  },
        { bill_number:2,paid_by:'C',amount:0  },
        { bill_number:2,paid_by:'D',amount:1300  },
        { bill_number:3,paid_by:'B',amount:1000  },
        { bill_number:3,paid_by:'C',amount:0  },
        { bill_number:4,paid_by:'X',amount:400 },
        { bill_number:4,paid_by:'Y',amount:3000 },
        { bill_number:4,paid_by:'Z',amount:400 },
        { bill_number:5,paid_by:'E',amount:500 },
        { bill_number:5,paid_by:'F',amount:700 },
        { bill_number:5,paid_by:'G',amount:800 }
    ]
}

function init(){
    printTransactions()
    billAverage()
}

//Printing the Input Transaction values
function printTransactions(){
    console.log('----------------------------------------------------------')
    console.log('Input Transaction Values')
    for(let i=0;i<state.transactions.length;i++){
        console.log(state.transactions[i])
    }
    console.log('----------------------------------------------------------')
}

//Finding average of each bill
function billAverage(){
    bill_average_list = []
    bill_number_list = []
    count = 0 
    //Finding the number of bills
    for(let i=0;i<state.transactions.length;i++){
        if(!bill_number_list.includes (state.transactions[i].bill_number)){
            bill_number_list.push(count++)
        }
    }

    //Finding the total amount and average of each bill
    for(let bill_number = 1;bill_number<bill_number_list.length;bill_number++)
    {
        count = 0
        total_amount = 0
        for(let i=0;i<state.transactions.length;i++)
        {
            if(state.transactions[i].bill_number == bill_number)
            {
                total_amount += state.transactions[i].amount 
                count++ 
            }
        }
        average = total_amount/count
        bill_average_list.push(average)
    }
    //console.log(bill_average_list)
    contributionPerPerson()
}

//Finding the contribution of each person
function contributionPerPerson(){
    people = findPeople() 
    contribution_list = []
    for(let i=0;i<people.length;i++){
        contribution_list.push(findContribution(people[i]))
    }
    //console.log(contribution_list)
    amountPaid(contribution_list)
}

//Finding all the persons who are involved
function findPeople(){
    people = []
    for(let i=0;i<state.transactions.length;i++)
    {
        if(!people.includes(state.transactions[i].paid_by)){
            people.push(state.transactions[i].paid_by)
        }
    }
    return people
}

//Finding the contribution of a person in ever bill
function findContribution(person){ 
    contribution = 0 
    for(let i=0;i<state.transactions.length;i++)
    {
        if(state.transactions[i].paid_by === person)
        {
            for(let j=1;j<=bill_average_list.length;j++)
            {
                if(state.transactions[i].bill_number == j)
                {
                    contribution += bill_average_list[j-1]
                }
            }
        }
    }
    return contribution
}

//Finding the total amount paid by ach person
function amountPaid(contribution_list){
    people = findPeople()
    amount_paid_list = []
    for(let i=0;i<people.length;i++)
    {
        total_amount_paid = 0 
        for(let j=0;j<state.transactions.length;j++)
        {
            if(state.transactions[j].paid_by === people[i]) 
            {
                total_amount_paid += state.transactions[j].amount 
            }
        }
        amount_paid_list.push(total_amount_paid) 
    }
    //console.log(amount_paid_list)
    remainingAmount(amount_paid_list,contribution_list)
}

//Finding the amount to be owed by each person
function remainingAmount(amount_paid_list,contribution_list){
    remaining_list = []
    for(let i =0;i<amount_paid_list.length;i++){
        remaining_list.push(amount_paid_list[i]-contribution_list[i]) 
    }
    //console.log(remaining_list)
    settlement(remaining_list)
}

//Settlement by each person
function settlement(remaining_list){
    people = findPeople()
    person_object = {}
    for(let i=0;i<remaining_list.length;i++){
        person_object[people[i]] = remaining_list[i]
    }
    console.log('Amount paid/owed by each person : ')
    console.log(person_object)
    console.log('----------------------------------------------------------')
    person_to_get_array = []
    person_to_pay_array = [] 
    person_to_get = {}
    person_to_pay = {}

    //Sorting the positive and negative remaining amounts 
    for (key in person_object){
        if(person_object[key]>0)
            person_to_get_array.push(person_object[key])
        else
            person_to_pay_array.push(person_object[key])
    }

    function sortNum(a,b){
        return a-b
    }
    person_to_get_array.sort(sortNum).reverse()
    person_to_pay_array.sort(sortNum)

    //Separate objects for positive and negative values
    for(i of person_to_get_array){
        for(j in person_object){
            if(i == person_object[j]){
                person_to_get[j] = i
            }
        }
    }

    for(i of person_to_pay_array){
        for(j in person_object){
            if(i == person_object[j]){
                person_to_pay[j] = i
            }
        }
    }

    //Printing the Summary
    console.log('SUMMARY : ')
    for(i in person_to_get){ 
        for(j in person_to_pay){
            if(Math.round(Math.abs(person_to_get[i])) != 0 & Math.round(Math.abs(person_to_pay[j])) != 0){
                if(person_to_get[i]<Math.abs(person_to_pay[j]))
                {
                    console.log(`${j} has to pay ${i} : Rs.${person_to_get[i].toFixed(2)} `)
                    remaining = person_to_pay[j] + person_to_get[i]
                    person_to_pay[j] = remaining
                    person_to_get[i] = 0
                }
                else if(person_to_get[i]>Math.abs(person_to_pay[j]))
                {
                    console.log(`${j} has to pay ${i} : Rs.${Math.abs(person_to_pay[j].toFixed(2))} `)
                    remaining = person_to_pay[j] + person_to_get[i]
                    person_to_pay[j] = 0
                    person_to_get[i] = remaining
                }
                else if(person_to_get[i] == Math.abs(person_to_pay[j]))
                {
                    console.log(`${j} has to pay ${i} : Rs.${person_to_get[i].toFixed(2)} `)
                    person_to_get[i] = 0
                    person_to_pay[j] = 0             
                }
                else
                    break
            }
        } 
    }
}

init()
