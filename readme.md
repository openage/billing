# Billing and Payment Service

## Goals

### Invoice Workflow

- Generate and manage `invoice`. It can take the request for invoice from different **services** like __inv__, __welcome__ etc
- Update requesting __service__ as the `status` of invoice changes

### Scheduled Invoicing

- __Auto invoice__ a buyer on a predefined date
- Fetch and log consumption

### Payment Workflow

- Generate and manage `payment` against an invoice
- Update the __invoice__ requesting **service** the `status` of payment

### Notifications

- Notify buyer on invoice generation
- Notify seller on payments

### Settings

- Maintain `rates`, `unitLogs` against an entity and its type
- Maintain different __modes of payment__ for a tenant
- Maintain __payment gateways__ for a tenant or seller organization

## Conventions

- types are plural
  - `entityType.name`,
  - `entityType.owner.name`

# Key Concepts


## Entity and Entity Type

Any product or service exist in the system as `entity` and `entityType`. For example

**Crocin** is a product that can be sold over the counter and has been added by `inv` service

```JS
id: '5afaddf9e446b00b7bd28d1a'
name: 'crocin',
rates: [{
  code: 'price',
  value: 2, // Rs per pill
  type: 'metered'
}]
type: {
  name: 'medicines'
  category: 'over-the-counter-medicine',
  service: {
    code: 'inv'
  }
}
```

**Doctor's appointment** is an entity whose type has an `owner` who controls its pricing.

```JS
id: '5afaddf9e446b00b7bd28d1a'
name: '2:30 pm at Fortis Hospital',
type: {
  name: 'appointments'
  rate: [{
    code: 'price',
    value: 500
  }],
  category: 'tax-exempted',
  owner: {
    id: '9afaddf9e446b00b7bd28d1f',
    type: 'doctors'
  },
  service: {
    code: 'inv'
  }
}
```

**Trip** is a `metered` entity owned by a route or vehicle

```JS
id: '5afaddf9e446b00b7bd28d1a'
name: 'From PCL Chownk to Sector 17',
consumption: {
  units: 5.6 // kms
},
type: {
  name: 'trips'
  rate: [{
    code: 'price',
    value: 10 // Rs per km
    type: 'metered'
  }],
  category: 'service',
  owner: {
    id: '9afaddf9e446b00b7bd28d1f',
    type: 'vehicles'
  }
}
```

**Semester of a Course** is an entity billed to student(a buyer) when he joins the semester

```JS
id: '5afaddf9e446b00b7bd28d1a'
name: '1st Semester',
billing: {
    auto: true,
    periodicity: {
        type: 'once'
    },
    buyers: [{
      id: '9afaddf9e446b00b7bd28d1f'
    }, {
      id: '9afaddf9e446b00b7bd28d1f'
    }]
},
rate: [{ // additional fees apart from the one in the type
  code: 'admission',
  description: 'Admission Fees'
  value: 5000 // Rs
}],
type: {
  name: 'semesters'
  rate: [{ // additional fees apart from the one in the type
    code: 'tuition',
    description: 'Tuition Fees'
    value: 10000 // Rs
  }],
  category: 'service',
}
```

### When an entity is created

Entity can be created at 2 places

#### 1. when a rate is configured for billing

- when a **product** is created in `inv` system it pushes it to `bap` as an entity and sets it price (entity rate)
- when an *agent* (an `owner`) configures the rate of his **appointment** (an entityType `appointments`)

#### 2. when an invoice is created

If the **line item's** entity does not exist, a new one is created. For example from the following line item

```JS 
{
  lineItems: [{
    amount: 10,
    consumption: {
        quantity: 5,
    },
    entity: {
        id: '5afaddf9e446b00b7bd28d1a',
        name: 'crocin',
        type: {
            name: 'medicines',
            category: 'essential-medicine' 
        }
    }
  }],
  service: {
    code: 'inv'
  }
}
```

the entity created would be something like this

```JS
id: '5afaddf9e446b00b7bd28d1a'
name: 'crocin',
rate: [{
  code: 'price',
  value: 2, // amount/consumption.quantity
  type: 'metered'
}],
type: {
  name: 'medicines'
  category: 'essential-medicine',
  service: {
    code: 'inv'
  }
}
```





## when payment is done

- notification is sent to payment 
