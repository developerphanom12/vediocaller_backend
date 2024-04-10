const adminservcie = require("../service/adminservice");
const db = require('../Database/connection');





const subscriptionadd = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  console.log("User role:", role);
  console.log("User ID:", userId);

  try {
    if (role !== "user") {
      return res
        .status(403)
        .json({ status: 403, error: "Forbidden for regular users" });
    }

    const {price,duration,name,minutes} = req.body;


    const category = await adminservcie.subcategoryAdd(price,duration,name,minutes);

    res.status(201).json({
      status: 201,
      message: category,
    });
  } catch (error) {
    console.error("Error in add category:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add category",
      stack: error.stack,
    });
  }
};

async function getUserSubscriptionDuration(subscriptionId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT minutes
            FROM subscription_plan
            WHERE id = ?`;

        db.query(query, [subscriptionId], (error, results) => {
            if (error) {
                console.error('Error fetching subscription duration:', error);
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0].minutes);
                } else {
                    reject('Subscription not found');
                }
            }
        });
    });
}


async function getUserSubscriptionDurations(subscriptionId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT duration
            FROM subscription_plan
            WHERE id = ?`;

        db.query(query, [subscriptionId], (error, results) => {
            if (error) {
                console.error('Error fetching subscription duration:', error);
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0].duration);
                } else {
                    reject('Subscription not found');
                }
            }
        });
    });
}
async function addUserSubscription(subscriptionId, selectedDaysWithTime) {
    try {
        const subscriptionDuration = await getUserSubscriptionDuration(subscriptionId);
        console.log("Subscription Duration:", subscriptionDuration);
        const subscriptionDurationasss = await getUserSubscriptionDurations(subscriptionId);
        console.log("SubscriptionDuration:", subscriptionDurationasss);
        const currentDate = new Date(); 
        const number = subscriptionDurationasss; 
        const endDate = new Date(currentDate.getTime() + number * 24 * 60 * 60 * 1000);
        console.log("End Date:", endDate.toISOString().split('T')[0]); 
        

        const filteredDaysWithTime = selectedDaysWithTime.filter(dayWithTime => {
            const selectedDate = new Date(dayWithTime.day);
            return selectedDate >= currentDate && selectedDate <= endDate;
        });

        if (filteredDaysWithTime.length !== selectedDaysWithTime.length) {
            throw new Error(`Please select dates within the next 30 days.`);
        }

        // Calculate the total provided minutes from the filtered selected days with time
        let totalMinutesProvided = filteredDaysWithTime.reduce((total, dayWithTime) => {
            return total + parseInt(dayWithTime.minutes);
        }, 0);
        console.log("Total Minutes Provided:", totalMinutesProvided);

        if (totalMinutesProvided > subscriptionDuration) {
            throw new Error(`The total provided minutes exceed the allowed duration for this subscription plan.`);
        }

        const insertSql = `
            INSERT INTO new_subscription_table (subscription_id, day, minutes)
            VALUES ?`;
        const values = filteredDaysWithTime.map(dayWithTime => [
            subscriptionId,
            dayWithTime.day,
            parseInt(dayWithTime.minutes),
        ]);
        await db.query(insertSql, [values]);

        return 'Subscription details added successfully.';
    } catch (error) {
        throw error;
    }
}

const addSubscriptionControllerss = async (req, res) => {
    try {
        const { subscriptionId, selectedDaysWithTime } = req.body;
        const result = await addUserSubscription(subscriptionId, selectedDaysWithTime);
        res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error('Error adding user subscription:', error);
        res.status(400).json({ success: false, error: error.message }); // Send error message as JSON response
    }
}




module.exports = {
    subscriptionadd,
    addUserSubscription,
    addSubscriptionControllerss
};
