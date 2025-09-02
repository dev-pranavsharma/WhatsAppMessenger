import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Send, Eye, Search, Filter, BadgeCheckIcon } from 'lucide-react';
import { templateService } from '../services/api';
import LoadingSpinner from '../components/loading-spinner';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import Wrapper from '../elements/wrapper';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import CreateCampaign from '../campaign/create';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

  const LoadingSkeleton =()=>{
    const data = [1,2,3,4,5,6]
    return (
      <main className='space-y-6'>
        <h2>Templates</h2>
      <section className='grid lg:grid-cols-3 grid-cols-2 items-center gap-5 justify-between'>
        {
        data.map((i)=>(
        <Card key={i}>
                <CardHeader>
                  <CardTitle className={'capitalize'}><Skeleton className="h-6 w-3/4 mb-3" /></CardTitle>
                  <CardDescription><Skeleton className="h-6 w-full" /></CardDescription>
                  <CardAction>
                    <Skeleton className="h-6 w-full" />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <Card>
                          <CardHeader>
                           <CardTitle><Skeleton className="h-4 w-2/4 mb-3" /></CardTitle>
                            <CardDescription><Skeleton className="h-6 w-full" /></CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-12 w-full" />
                          </CardContent>
                          

                  </Card>

                </CardContent>
                <CardFooter>
                <Skeleton className="h-4 w-full" />
                </CardFooter>
        </Card>
        ))
        }
    </section>
    </main>
    )
  }
const Templates = () => {
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTemplates = async () => {
      try {
        setLoading(true);
        const data = await templateService.getTemplates({ waba_id: tenant.waba_id, access_token: tenant.access_token })
      } catch (err) {
        setError('Failed to load templates');
        console.error('Template loading error:', err);
      } finally {
        setLoading(false);
      }
  }
  useEffect(() => {
    if (tenant?.waba_id && templates.length == 0) {
    loadTemplates();
    }
  }, [tenant?.waba_id]);
  console.log('templates', templates, tenant);

                             

  return (
    <Wrapper error={error} loading={loading} Skeleton={LoadingSkeleton} className="space-y-6">
      {/* Page header */}
      <h2>Templates</h2>

      <section className='grid lg:grid-cols-3 grid-cols-2 items-center justify-between'>
        {
          templates && templates.map((data,i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className={'capitalize'}>{data.name}</CardTitle>
                  <CardDescription>{data.category}</CardDescription>
                  <CardAction>
                    <Badge variant={'secondary'}>
                      {data.status}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <Card>
                    {
                      data.components.map((Data,key) => (
                        <div key={key}>
                          <CardHeader>
                            {Data.type == 'HEADER' && <CardTitle>{Data.format}</CardTitle>}
                            <CardDescription></CardDescription>
                          </CardHeader>
                          <CardContent>
                            {Data.type=='BODY'&&<p>{Data.text}</p>}
                            {Data.type == 'BUTTONS' &&
                              Data.buttons.map((btn,k)=>(
                                <div key={k}>
                                  {btn.type=='URL'&&<Button className={'mb-3 w-full'} variant='outline' asChild><a target='__blank' href={btn.url}>{btn.text}</a></Button>}
                                  </div>
                              ))
                             
                             }
                          </CardContent>
                          
                        </div>

                      ))
                    }
                  </Card>

                </CardContent>
                <CardFooter className={'flex justify-between'}>
                  <Dialog>
                  <DialogTrigger asChild>
                  <Button>Use Template</Button>
                  </DialogTrigger>
                  
                       <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Template Details</DialogTitle>
                        <DialogDescription>fill details of the template </DialogDescription>   
                    </DialogHeader>
                              {
                                (()=>{
                                  const name_params = data.components.find((component)=>component.type==='BODY').example.body_text_named_params
                                  console.log(name_params);
                                 return name_params.map((param)=>(
                                      <div>
                                      <Label>{param.param_name}</Label>
                                      <Input placeholder={param.example}/>
                                      </div>
                                  ))
                                })()
                                
                              }
                               <DialogFooter>
                              <Button>Message</Button>
                        </DialogFooter>  
                        </DialogContent>   
                              
                  </Dialog>
                  <Button variant='destructive'>Delete</Button>
                </CardFooter>
              </Card>
          ))
        }
      </section>

      {/* Error message */}
    </Wrapper>
  );
};

export default Templates;