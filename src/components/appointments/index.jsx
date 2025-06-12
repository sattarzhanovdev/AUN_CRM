import React from 'react'
import c from './appointments.module.scss'
import { API } from '../../api'

const Appointments = () => {
  const [ appointments, setAppointments ] = React.useState(null)
  const [ workers, setWorkers ] = React.useState(null)

  const date = new Date()
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate()}`
  

    React.useEffect(() => {
      API.getWorkers().then(res => {
        const workersData = res.data;
        setWorkers(workersData);
  
        API.getClients().then(res => {
          const clients = res.data;
  
          const result = workersData.map(worker => {
            const appointments = [];
  
            clients.forEach(client => {
              if (client.appointment_date === todayDate) {
                client.services.forEach(service => {
                  if (service.assigned === worker.name) {
                    appointments.push(`${service.time} - ${service.name}`);
                  }
                });
              }
            });
  
            return {
              name: worker.name,
              appointments
            };
          });
  
          setAppointments(result);
        });
      });
    }, []);

  appointments?.map(item => {
    item.appointments.map(service => {
      console.log(service.split(' - ')[0]);
    })
  })

  return (
    <div className={c.appointments}>
      <div className={c.header}>
        <h1>
          Записи сотрудников
        </h1>
        <span>
          {date.getDate()} {date.toLocaleString('ru-RU', { month: 'long' })}
        </span>
      </div>

      <div className={c.workers}>
        {
          appointments && appointments.map((worker, index) => {
            // Сортируем приёмы по времени
            const sortedAppointments = [...worker.appointments].sort((a, b) => {
              const timeA = a.split(' - ')[0];
              const timeB = b.split(' - ')[0];
              return timeA.localeCompare(timeB);
            });

            let prevTimeMinutes = null;

            return (
              <div className={c.worker} key={index}>
                <p>{worker.name}</p>
                <div className={c.times}>
                  {
                    sortedAppointments.map((timeStr, i) => {
                      const [time] = timeStr.split(' - ');
                      const [hours, minutes] = time.split(':').map(Number);
                      const currentTimeMinutes = hours * 60 + minutes;

                      let className = '';

                      if (prevTimeMinutes !== null) {
                        const diff = currentTimeMinutes - prevTimeMinutes;
                        if (diff >= 180) {
                          className = c.hard;
                        } else if (diff >= 90) {
                          className = c.medium;
                        }
                      }

                      prevTimeMinutes = currentTimeMinutes;

                      return (
                        <span key={i} className={className}>
                          {timeStr}
                        </span>
                      );
                    })
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  )
}

export default Appointments