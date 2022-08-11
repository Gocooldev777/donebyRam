/* 
Explanation
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

D has to pay A : Rs.950 
C has to pay A : Rs.483.33 
B has to pay A : Rs.183.33 
*/

//Input transactions
state = {
    transactions : [
        { bill_number:1,paid_by:'A',amount:1000 },
        { bill_number:1,paid_by:'B',amount:2000 },
        { bill_number:1,paid_by:'C',amount:1000 },
        { bill_number:2,paid_by:'A',amount:300  },
        { bill_number:2,paid_by:'B',amount:400  },
        { bill_number:2,paid_by:'C',amount:100  },
        { bill_number:2,paid_by:'D',amount:200  },
        { bill_number:3,paid_by:'A',amount:3000 },
        { bill_number:3,paid_by:'B',amount:100  },
        { bill_number:3,paid_by:'D',amount:200  }
    ]
}

function init(){
    print_transactions()
    bill_average()
}

//Printing the Input Transaction values
function print_transactions(){
    console.log('----------------------------------------------------------')
    console.log('Input Transaction Values')
    for(let i=0;i<state.transactions.length;i++){
        console.log(state.transactions[i])
    }
    console.log('----------------------------------------------------------')
}

//Finding average of each bill
function bill_average(){
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
    contribution_per_person()
}

//Finding the contribution of each person
function contribution_per_person(){
    people = find_people() 
    contribution_list = []
    for(let i=0;i<people.length;i++){
        contribution_list.push(find_contribution(people[i]))
    }
    //console.log(contribution_list)
    amount_paid(contribution_list)
}

//Finding all the persons who are involved
function find_people(){
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
function find_contribution(person){ 
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
function amount_paid(contribution_list){
    people = find_people()
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
    remaining_amount(amount_paid_list,contribution_list)
}

//Finding the amount to be owed by each person
function remaining_amount(amount_paid_list,contribution_list){
    remaining_list = []
    for(let i =0;i<amount_paid_list.length;i++){
        remaining_list.push(amount_paid_list[i]-contribution_list[i]) 
    }
    //console.log(remaining_list)
    settlement(remaining_list)
}

//Settlement by each person
function settlement(remaining_list){
    people = find_people()
    person_object = {}
    for(let i=0;i<remaining_list.length;i++){
        person_object[people[i]] = remaining_list[i]
    }
    console.log('Amount paid/owed by each person : ')
    console.log(person_object)
    console.log('----------------------------------------------------------')
    positive_arr = []
    negative_arr = [] 
    positive_values = {}
    negative_values = {}

    //Sorting the positive and negative remaining amounts 
    for (key in person_object){
        if(person_object[key]>0)
            positive_arr.push(person_object[key])
        else
            negative_arr.push(person_object[key])
    }

    function sortNum(a,b){
        return a-b
    }
    positive_arr.sort(sortNum).reverse()
    negative_arr.sort(sortNum)

    //Separate objects for positive and negative values
    for(i of positive_arr){
        for(j in person_object){
            if(i == person_object[j]){
                positive_values[j] = i
            }
        }
    }

    for(i of negative_arr){
        for(j in person_object){
            if(i == person_object[j]){
                negative_values[j] = i
            }
        }
    }

    //Printing the Summary
    console.log('SUMMARY : ')
    for(i in positive_values){ 
        for(j in negative_values){
            if(positive_values[i] != 0 & negative_values[j] != 0){
                if(positive_values[i]<Math.abs(negative_values[j]))
                {
                    console.log(`${j} has to pay ${i} : Rs.${positive_values[i].toFixed(2)} `)
                    remaining = negative_values[j] + positive_values[i]
                    negative_values[j] = remaining
                    positive_values[i] = 0
                }
                else if(positive_values[i]>Math.abs(negative_values[j]))
                {
                    console.log(`${j} has to pay ${i} : Rs.${Math.abs(negative_values[j].toFixed(2))} `)
                    remaining = negative_values[j] + positive_values[i]
                    negative_values[j] = 0
                    positive_values[i] = remaining
                }
                else if(positive_values[i] == Math.abs(negative_values[j]))
                {
                    console.log(`${j} has to pay ${i} : Rs.${positive_values[i].toFixed(2)} `)
                    positive_values[i] = 0
                    negative_values[j] = 0             
                }
                else
                    break
            }
        } 
    }
}

init()